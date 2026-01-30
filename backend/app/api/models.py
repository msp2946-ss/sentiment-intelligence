from pydantic import BaseModel
from typing import List, Optional

class SentimentRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    sentiment: str
    confidence: float
    probabilities: dict

class BulkSentimentRequest(BaseModel):
    texts: List[str]

class BulkSentimentResponse(BaseModel):
    results: List[SentimentResponse]
