import os
from typing import Any

import joblib
import numpy as np

from .train import MODEL_PATH, preprocess_text, train_model

model_bundle: dict[str, Any] | None = None


def load_resources() -> None:
    global model_bundle

    if model_bundle is not None:
        return

    if not os.path.exists(MODEL_PATH):
        train_model()

    model_bundle = joblib.load(MODEL_PATH)


def _format_response(predicted_label: str, probabilities: dict[str, float]) -> dict[str, Any]:
    sentiment = predicted_label.capitalize()
    confidence = float(probabilities.get(predicted_label, 0.0))
    return {
        "sentiment": sentiment,
        "confidence": confidence,
        "probabilities": {
            "positive": float(probabilities.get("positive", 0.0)),
            "neutral": float(probabilities.get("neutral", 0.0)),
            "negative": float(probabilities.get("negative", 0.0)),
        },
    }


def predict_sentiment(text: str) -> dict[str, Any]:
    load_resources()
    if not model_bundle or "pipeline" not in model_bundle:
        raise RuntimeError("Model bundle is not loaded")

    pipeline = model_bundle["pipeline"]
    clean_text = preprocess_text(text)
    if not clean_text:
        return {
            "sentiment": "Neutral",
            "confidence": 0.34,
            "probabilities": {
                "positive": 0.33,
                "neutral": 0.34,
                "negative": 0.33,
            },
        }

    predicted_label = str(pipeline.predict([clean_text])[0]).lower()
    proba = pipeline.predict_proba([clean_text])[0]
    classes = [str(c).lower() for c in pipeline.classes_]

    probabilities = {label: 0.0 for label in ["positive", "neutral", "negative"]}
    for idx, cls in enumerate(classes):
        if cls in probabilities:
            probabilities[cls] = float(proba[idx])

    # Normalize once more for safety if classes are in unexpected order/shape.
    total = float(np.sum(list(probabilities.values())))
    if total > 0:
        probabilities = {k: v / total for k, v in probabilities.items()}

    if predicted_label not in probabilities:
        predicted_label = max(probabilities, key=lambda cls: probabilities[cls])

    return _format_response(predicted_label, probabilities)
