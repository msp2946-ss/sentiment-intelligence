import os
import nltk
import pandas as pd
import numpy as np
import joblib
import re
import string
from nltk.corpus import movie_reviews, stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score

# Ensure data directories exist
os.makedirs('backend/app/model_artifacts', exist_ok=True)

# Download necessary NLTK data
print("Downloading NLTK data...")
nltk.download('movie_reviews')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')
nltk.download('punkt')
nltk.download('punkt_tab')

def load_data():
    print("Loading Movie Reviews dataset...")
    documents = []
    for category in movie_reviews.categories():
        for fileid in movie_reviews.fileids(category):
            documents.append((movie_reviews.raw(fileid), category))
    
    df = pd.DataFrame(documents, columns=['text', 'sentiment'])
    print(f"Loaded {len(df)} reviews.")
    return df

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

def preprocess_text(text):
    # Lowercase
    text = text.lower()
    # Remove punctuation
    text = re.sub(f'[{re.escape(string.punctuation)}]', '', text)
    # Tokenize (simple split for speed or nltk word_tokenize)
    tokens = text.split()
    # Remove stopwords and lemmatize
    tokens = [lemmatizer.lemmatize(word) for word in tokens if word not in stop_words]
    return ' '.join(tokens)

def train_model():
    df = load_data()
    
    print("Preprocessing data...")
    df['clean_text'] = df['text'].apply(preprocess_text)
    
    X = df['clean_text']
    y = df['sentiment']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Pipeline (TF-IDF + LinearSVC)...")
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1,2))),
        ('clf', LinearSVC(random_state=42))
    ])
    
    pipeline.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = pipeline.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(classification_report(y_test, y_pred))
    
    # Save model
    model_path = 'backend/app/model_artifacts/sentiment_model.pkl'
    joblib.dump(pipeline, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_model()
