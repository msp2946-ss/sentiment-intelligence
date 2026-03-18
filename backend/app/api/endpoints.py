from typing import Any, Dict
import logging

from fastapi import APIRouter, Depends, HTTPException, Request
import os
import smtplib
from email.message import EmailMessage

from .models import (
    BulkSentimentRequest,
    BulkSentimentResponse,
    SupportContactRequest,
    SupportContactResponse,
    SentimentRequest,
    SentimentResponse,
)
from ..auth.dependencies import get_current_user
from ..core.rate_limit import rate_limit
from ..core.security_logging import log_security_event
from ..model.predict import predict_sentiment

router = APIRouter()

predict_rate_limit = rate_limit(limit=60, window_seconds=60, scope="predict")
predict_bulk_rate_limit = rate_limit(limit=20, window_seconds=60, scope="predict_bulk")
support_rate_limit = rate_limit(limit=10, window_seconds=300, scope="support_contact")


def _send_support_email(email_message: EmailMessage, smtp_user: str, smtp_password: str) -> str:
    # Prefer implicit TLS on 465; fallback to STARTTLS on 587 for environments
    # where direct SSL sockets are restricted.
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=20) as smtp:
            smtp.login(smtp_user, smtp_password)
            smtp.send_message(email_message)
        return "smtp_ssl_465"
    except Exception:
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=20) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
            smtp.login(smtp_user, smtp_password)
            smtp.send_message(email_message)
        return "smtp_starttls_587"


@router.get("/health")
def health_check():
    return {"status": "ok"}


@router.post("/predict", response_model=SentimentResponse)
def predict(
    request: SentimentRequest,
    req: Request,
    _rate_limit: None = Depends(predict_rate_limit),
    user: Dict[str, Any] = Depends(get_current_user),
):
    try:
        return SentimentResponse(**predict_sentiment(request.text))
    except Exception as exc:
        log_security_event(
            "predict_failed",
            level=logging.ERROR,
            path=req.url.path,
            method=req.method,
            user_sub=user.get("sub"),
            provider=user.get("provider"),
        )
        raise HTTPException(status_code=500, detail="Failed to process sentiment analysis.") from exc


@router.post("/predict-bulk", response_model=BulkSentimentResponse)
def predict_bulk(
    request: BulkSentimentRequest,
    req: Request,
    _rate_limit: None = Depends(predict_bulk_rate_limit),
    user: Dict[str, Any] = Depends(get_current_user),
):
    log_security_event(
        "predict_bulk_requested",
        path=req.url.path,
        method=req.method,
        user_sub=user.get("sub"),
        provider=user.get("provider"),
        text_count=len(request.texts),
    )
    results = []
    for text in request.texts:
        if not text or not text.strip():
            continue
        try:
            results.append(SentimentResponse(**predict_sentiment(text)))
        except Exception:
            results.append(
                SentimentResponse(
                    sentiment="Neutral",
                    confidence=0.34,
                    probabilities={
                        "positive": 0.33,
                        "neutral": 0.34,
                        "negative": 0.33,
                    },
                )
            )
    return BulkSentimentResponse(results=results)


@router.post("/support/contact", response_model=SupportContactResponse)
def support_contact(
    request: SupportContactRequest,
    req: Request,
    _rate_limit: None = Depends(support_rate_limit),
    user: Dict[str, Any] = Depends(get_current_user),
):
    smtp_user = (os.getenv("GMAIL_SMTP_USER") or "").strip()
    # Gmail app passwords are often displayed with spaces every 4 chars.
    smtp_password = (os.getenv("GMAIL_SMTP_APP_PASSWORD") or "").replace(" ", "").strip()
    to_email = os.getenv("SUPPORT_TO_EMAIL", "shreyanshji2946@gmail.com")
    subject_prefix = os.getenv("SUPPORT_SUBJECT_PREFIX", "SentiAI Support")

    if not smtp_user or not smtp_password:
        raise HTTPException(
            status_code=500,
            detail="Email service is not configured. Set GMAIL_SMTP_USER and GMAIL_SMTP_APP_PASSWORD.",
        )

    email_message = EmailMessage()
    email_message["From"] = smtp_user
    email_message["To"] = to_email
    email_message["Reply-To"] = request.email
    email_message["Subject"] = f"{subject_prefix}: {request.name}"
    email_message.set_content(
        "\n".join(
            [
                "New support request received.",
                "",
                f"Name: {request.name}",
                f"Email: {request.email}",
                "",
                "Message:",
                request.message,
            ]
        )
    )

    try:
        delivery_mode = _send_support_email(email_message, smtp_user, smtp_password)
    except Exception as exc:
        log_security_event(
            "support_contact_send_failed",
            level=logging.ERROR,
            path=req.url.path,
            method=req.method,
            user_sub=user.get("sub"),
            provider=user.get("provider"),
            error_type=type(exc).__name__,
            error_message=str(exc),
        )
        raise HTTPException(status_code=500, detail="Failed to send support message.") from exc

    log_security_event(
        "support_contact_sent",
        path=req.url.path,
        method=req.method,
        user_sub=user.get("sub"),
        provider=user.get("provider"),
        delivery_mode=delivery_mode,
    )

    return SupportContactResponse(success=True, detail="Support message sent successfully.")
