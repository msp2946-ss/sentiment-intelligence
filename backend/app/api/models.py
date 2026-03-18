from typing import Dict, List

from pydantic import BaseModel, Field


class SentimentRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)


class SentimentResponse(BaseModel):
    sentiment: str
    confidence: float
    probabilities: Dict[str, float]


class BulkSentimentRequest(BaseModel):
    texts: List[str] = Field(..., min_length=1, max_length=100)


class BulkSentimentResponse(BaseModel):
    results: List[SentimentResponse]


class SupportContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: str = Field(
        ...,
        min_length=5,
        max_length=320,
        pattern=r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$",
    )
    message: str = Field(..., min_length=10, max_length=4000)


class SupportContactResponse(BaseModel):
    success: bool
    detail: str
