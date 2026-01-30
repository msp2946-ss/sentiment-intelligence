import joblib
import os
import re
import string
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import numpy as np

# Load artifacts
MODEL_PATH = 'backend/app/model_artifacts/sentiment_model.pkl'
model = None

# We need to replicate preprocess logic or import it. 
# Importing from train.py might re-run training if not careful, so duplicating minimal logic or refactoring is better.
# For now, duplicating simple logic to avoid side effects of imports if train.py isn't clean.
stop_words = None
lemmatizer = None

def load_resources():
    global model, stop_words, lemmatizer
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
    else:
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
    
    from nltk.corpus import stopwords
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()

def preprocess_text(text):
    if not stop_words:
        load_resources()
    
    text = text.lower()
    text = re.sub(f'[{re.escape(string.punctuation)}]', '', text)
    tokens = text.split()
    tokens = [lemmatizer.lemmatize(word) for word in tokens if word not in stop_words]
    return ' '.join(tokens)

def predict_sentiment(text: str):
    if not model:
        load_resources()
    
    clean_text = preprocess_text(text)
    prediction = model.predict([clean_text])[0]
    
    # Get probabilities if supported
    try:
        probabilities = model.decision_function([clean_text])
        # LinearSVC decision_function gives distance to hyperplane, not prob directly.
        # We can implement a softmax or simple normalization if needed, or just return decision values.
        # For simplicity in this demo, we'll map distance to a confidence score or just return values.
        # A better way for probability with SVM is CalibratedClassifierCV, but we used LinearSVC.
        # Let's just normalize using simple sigmoid for display purposes.
        confidence = 1 / (1 + np.exp(-probabilities[0])) if len(probabilities.shape) == 1 else 0.5
        probs = {"score": float(probabilities[0])}
    except Exception:
        confidence = 0.0
        probs = {}

    return {
        "sentiment": prediction,
        "confidence": float(confidence), # This is a mockup for LinearSVC without calibration
        "probabilities": probs
    }
