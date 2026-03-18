from typing import Any, Dict
import logging

from fastapi import Header, HTTPException, Request, status

from ..core.security_logging import log_security_event
from .security import decode_token


def get_current_user(
    request: Request,
    authorization: str | None = Header(default=None),
) -> Dict[str, Any]:
    if not authorization:
        log_security_event(
            "auth_missing_authorization_header",
            level=logging.WARNING,
            path=request.url.path,
            method=request.method,
            client=request.client.host if request.client else "unknown",
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header.",
        )

    parts = authorization.split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer":
        log_security_event(
            "auth_invalid_authorization_format",
            level=logging.WARNING,
            path=request.url.path,
            method=request.method,
            client=request.client.host if request.client else "unknown",
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must be Bearer token.",
        )

    token = parts[1].strip()
    if not token:
        log_security_event(
            "auth_empty_bearer_token",
            level=logging.WARNING,
            path=request.url.path,
            method=request.method,
            client=request.client.host if request.client else "unknown",
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bearer token is empty.",
        )

    return decode_token(token)
