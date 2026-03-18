import os
import random
import re
import ssl
import string
from dataclasses import dataclass

import joblib
import nltk
from nltk.corpus import movie_reviews, stopwords, subjectivity
from nltk.stem import WordNetLemmatizer
from sklearn.calibration import CalibratedClassifierCV
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTIFACTS_DIR = os.path.join(BASE_DIR, "model_artifacts")
MODEL_PATH = os.path.join(ARTIFACTS_DIR, "sentiment_model.pkl")


@dataclass
class TrainingResult:
    model_path: str
    accuracy: float


_lemmatizer = WordNetLemmatizer()
_stop_words = set()


def _safe_lemmatize(token: str) -> str:
    try:
        return _lemmatizer.lemmatize(token)
    except LookupError:
        return token


def ensure_nltk_resources() -> None:
    try:
        ssl._create_default_https_context = ssl._create_unverified_context
    except Exception:
        pass

    resources = ["movie_reviews", "subjectivity", "stopwords", "wordnet", "omw-1.4"]
    for resource in resources:
        try:
            nltk.download(resource, quiet=True)
        except Exception:
            # Network/SSL issues should not block startup; we fall back below.
            pass


def _init_nlp() -> None:
    global _stop_words
    if not _stop_words:
        try:
            _stop_words = set(stopwords.words("english"))
        except LookupError:
            _stop_words = set(ENGLISH_STOP_WORDS)


def preprocess_text(text: str) -> str:
    _init_nlp()
    text = text.lower()
    text = re.sub(f"[{re.escape(string.punctuation)}]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    tokens = [
        _safe_lemmatize(token)
        for token in text.split()
        if token and token not in _stop_words
    ]
    return " ".join(tokens)


def _build_dataset() -> tuple[list[str], list[str]]:
    try:
        positive_docs = [movie_reviews.raw(fid) for fid in movie_reviews.fileids("pos")]
        negative_docs = [movie_reviews.raw(fid) for fid in movie_reviews.fileids("neg")]
    except (LookupError, OSError):
        positive_docs = [
            "I absolutely love this app. It is fast, beautiful, and very helpful.",
            "The service was excellent and I am very happy with the result.",
            "Great experience overall. Everything worked exactly as expected.",
            "Fantastic product quality and wonderful customer support.",
            "This is amazing, intuitive, and reliable.",
            "I am impressed with the smooth performance and thoughtful design.",
            "Superb update. The features are useful and easy to use.",
            "Highly recommended. It solved my problem perfectly.",
            "Very satisfied with the purchase and delivery.",
            "Excellent work. Clean interface and great usability.",
        ]
        negative_docs = [
            "This is the worst experience I have had. It keeps failing.",
            "Terrible quality and poor support. I regret this purchase.",
            "Very disappointing. Nothing works as advertised.",
            "The app crashes often and feels buggy.",
            "Bad performance, confusing design, and lots of errors.",
            "I am unhappy with the service and delayed response.",
            "Awful update. It removed useful features and added issues.",
            "Waste of time and money.",
            "Not recommended. The output is inaccurate and inconsistent.",
            "Frustrating experience from start to finish.",
        ]

    try:
        neutral_docs = [" ".join(str(token) for token in sent) for sent in subjectivity.sents("obj")]
    except (LookupError, OSError):
        neutral_docs = [
            "The package arrived yesterday and includes the listed items.",
            "The report was submitted on Monday for review.",
            "This document describes the setup steps and configuration.",
            "The meeting starts at 10 AM and ends at 11 AM.",
            "The product has a black finish and a two-year warranty.",
            "Version 2.1 was released with minor changes.",
            "The order contains three units and one accessory.",
            "The device weighs about 150 grams.",
            "Support is available on weekdays during business hours.",
            "The task was completed and marked as done.",
        ]

        # Expand neutral examples to avoid over-downsampling positive/negative corpora.
        subjects = ["order", "device", "package", "report", "item", "document", "meeting", "update"]
        verbs = ["arrived", "was processed", "was submitted", "was reviewed", "was scheduled", "was delivered"]
        details = [
            "on Monday",
            "yesterday",
            "with standard settings",
            "as requested",
            "according to the specification",
            "for routine verification",
        ]
        generated = []
        for subject in subjects:
            for verb in verbs:
                for detail in details:
                    generated.append(f"The {subject} {verb} {detail}.")
                    generated.append(f"This {subject} {verb} {detail} and was logged in the system.")
        neutral_docs.extend(generated)

    # Balance all 3 classes for stable training.
    min_count = min(len(positive_docs), len(negative_docs), len(neutral_docs))
    random.seed(42)
    random.shuffle(positive_docs)
    random.shuffle(negative_docs)
    random.shuffle(neutral_docs)

    positive_docs = positive_docs[:min_count]
    negative_docs = negative_docs[:min_count]
    neutral_docs = neutral_docs[:min_count]

    texts = positive_docs + negative_docs + neutral_docs
    labels = (
        ["positive"] * len(positive_docs)
        + ["negative"] * len(negative_docs)
        + ["neutral"] * len(neutral_docs)
    )
    return texts, labels


def train_model() -> TrainingResult:
    ensure_nltk_resources()
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)

    texts, labels = _build_dataset()
    clean_texts = [preprocess_text(t) for t in texts]

    x_train, x_test, y_train, y_test = train_test_split(
        clean_texts,
        labels,
        test_size=0.2,
        random_state=42,
        stratify=labels,
    )

    pipeline = Pipeline(
        steps=[
            ("tfidf", TfidfVectorizer(max_features=20000, ngram_range=(1, 2))),
            (
                "clf",
                CalibratedClassifierCV(
                    estimator=LinearSVC(random_state=42),
                    method="sigmoid",
                    cv=3,
                ),
            ),
        ]
    )

    pipeline.fit(x_train, y_train)
    predictions = pipeline.predict(x_test)
    accuracy = accuracy_score(y_test, predictions)

    bundle = {
        "pipeline": pipeline,
        "labels": ["positive", "neutral", "negative"],
        "accuracy": float(accuracy),
    }
    joblib.dump(bundle, MODEL_PATH)

    return TrainingResult(model_path=MODEL_PATH, accuracy=float(accuracy))


if __name__ == "__main__":
    result = train_model()
    print(f"Saved model to {result.model_path}")
    print(f"Validation accuracy: {result.accuracy:.4f}")
