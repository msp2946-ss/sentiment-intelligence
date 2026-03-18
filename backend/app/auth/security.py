from datetime import datetime, timedelta, timezone
import os
from typing import Any, Dict

import jwt
from fastapi import HTTPException, status


JWT_ALGORITHM = "HS256"


def _jwt_secret() -> str:
    return os.getenv("APP_JWT_SECRET", "")


def _jwt_expires_minutes() -> int:
    raw = os.getenv("APP_JWT_EXPIRES_MINUTES", "10080")
    try:
        return int(raw)
    except ValueError:
        return 10080


def ensure_jwt_secret() -> None:
    if not _jwt_secret():
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="APP_JWT_SECRET is not configured.",
        )


def create_access_token(payload: Dict[str, Any]) -> str:
    ensure_jwt_secret()
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=_jwt_expires_minutes())
    token_payload = {
        **payload,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }
    return jwt.encode(token_payload, _jwt_secret(), algorithm=JWT_ALGORITHM)


def create_oauth_state(provider: str, next_path: str = "/") -> str:
    ensure_jwt_secret()
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=15)
    payload = {
        "provider": provider,
        "next": next_path,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }
    return jwt.encode(payload, _jwt_secret(), algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> Dict[str, Any]:
    ensure_jwt_secret()
    try:
        decoded = jwt.decode(token, _jwt_secret(), algorithms=[JWT_ALGORITHM])
        if not isinstance(decoded, dict):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload.",
            )
        return decoded
    except jwt.InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
        ) from exc
