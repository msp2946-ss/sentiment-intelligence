from typing import Any, Dict
import logging

from fastapi import APIRouter, Depends, HTTPException, Request
import os
import smtplib
from email.message import EmailMessage
import requests

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


def _send_support_email_resend(
    *,
    api_key: str,
    from_email: str,
    to_email: str,
    reply_to: str,
    subject: str,
    text_body: str,
) -> str:
    response = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "from": from_email,
            "to": [to_email],
            "subject": subject,
            "text": text_body,
            "reply_to": reply_to,
        },
        timeout=20,
    )

    if response.status_code >= 400:
        raise RuntimeError(f"Resend API error ({response.status_code}): {response.text[:300]}")

    return "resend_api"


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
    resend_api_key = (os.getenv("RESEND_API_KEY") or "").strip()
    support_from_email = (os.getenv("SUPPORT_FROM_EMAIL") or smtp_user).strip()
    to_email = os.getenv("SUPPORT_TO_EMAIL", "shreyanshji2946@gmail.com")
    subject_prefix = os.getenv("SUPPORT_SUBJECT_PREFIX", "SentiAI Support")

    smtp_configured = bool(smtp_user and smtp_password)
    resend_configured = bool(resend_api_key and support_from_email)

    if not smtp_configured and not resend_configured:
        raise HTTPException(
            status_code=500,
            detail=(
                "Email service is not configured. "
                "Set RESEND_API_KEY with SUPPORT_FROM_EMAIL or set GMAIL_SMTP_USER and GMAIL_SMTP_APP_PASSWORD."
            ),
        )

    email_message = EmailMessage()
    email_message["From"] = smtp_user
    email_message["To"] = to_email
    email_message["Reply-To"] = request.email
    subject = f"{subject_prefix}: {request.name}"
    email_message["Subject"] = subject
    text_body = "\n".join(
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
    email_message.set_content(text_body)

    try:
        if resend_configured:
            delivery_mode = _send_support_email_resend(
                api_key=resend_api_key,
                from_email=support_from_email,
                to_email=to_email,
                reply_to=request.email,
                subject=subject,
                text_body=text_body,
            )
        else:
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
