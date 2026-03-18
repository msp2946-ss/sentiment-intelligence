import os
from urllib.parse import urlencode
import logging

import requests
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import RedirectResponse

from ..auth.dependencies import get_current_user
from ..auth.security import create_access_token, create_oauth_state, decode_token
from ..core.rate_limit import rate_limit
from ..core.security_logging import log_security_event

router = APIRouter()

oauth_start_rate_limit = rate_limit(limit=30, window_seconds=60, scope="oauth_start")
oauth_callback_rate_limit = rate_limit(limit=60, window_seconds=60, scope="oauth_callback")
auth_me_rate_limit = rate_limit(limit=120, window_seconds=60, scope="auth_me")


def _frontend_callback_url() -> str:
    return os.getenv("FRONTEND_AUTH_CALLBACK_URL", "http://localhost:5173/auth/callback")


def _sanitize_next_path(next_path: str | None) -> str:
    candidate = (next_path or "/").strip()
    if not candidate.startswith("/"):
        return "/"
    if candidate.startswith("//"):
        return "/"
    return candidate


def _redirect_with_error(message: str) -> RedirectResponse:
    target = f"{_frontend_callback_url()}?{urlencode({'error': message})}"
    return RedirectResponse(url=target, status_code=302)


@router.get("/google/login")
def google_login(
    request: Request,
    next_path: str = Query(default="/", alias="next"),
    _rate_limit: None = Depends(oauth_start_rate_limit),
):
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")

    if not client_id or not redirect_uri:
        raise HTTPException(status_code=500, detail="Google OAuth is not configured.")

    safe_next = _sanitize_next_path(next_path)
    state = create_oauth_state("google", next_path=safe_next)
    log_security_event(
        "oauth_google_login_started",
        path=request.url.path,
        method=request.method,
        next_path=safe_next,
    )
    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "prompt": "consent",
        "access_type": "offline",
        "state": state,
    }
    url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    return RedirectResponse(url=url, status_code=302)


@router.get("/google/callback")
def google_callback(
    request: Request,
    code: str | None = None,
    state: str | None = None,
    _rate_limit: None = Depends(oauth_callback_rate_limit),
):
    if not code or not state:
        log_security_event(
            "oauth_google_callback_missing_fields",
            level=logging.WARNING,
            path=request.url.path,
            method=request.method,
        )
        return _redirect_with_error("Missing OAuth code or state")

    try:
        state_data = decode_token(state)
    except HTTPException:
        log_security_event(
            "oauth_google_invalid_state",
            level=logging.WARNING,
            path=request.url.path,
            method=request.method,
        )
        return _redirect_with_error("Invalid OAuth state")

    if state_data.get("provider") != "google":
        log_security_event(
            "oauth_google_provider_mismatch",
            level=logging.WARNING,
            path=request.url.path,
            method=request.method,
        )
        return _redirect_with_error("Invalid OAuth state")

    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    if not client_id or not client_secret or not redirect_uri:
        return _redirect_with_error("Google OAuth config missing")

    token_resp = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        },
        timeout=20,
    )

    if token_resp.status_code >= 400:
        log_security_event(
            "oauth_google_token_exchange_failed",
            level=logging.WARNING,
            path=request.url.path,
            method=request.method,
        )
        return _redirect_with_error("Google token exchange failed")

    token_data = token_resp.json()
    access_token = token_data.get("access_token")
    if not access_token:
        log_security_event(
            "oauth_google_access_token_missing",
            level=logging.WARNING,
            path=request.url.path,
            method=request.method,
        )
        return _redirect_with_error("Google access token missing")

    user_resp = requests.get(
        "https://openidconnect.googleapis.com/v1/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=20,
    )
    if user_resp.status_code >= 400:
        log_security_event(
            "oauth_google_userinfo_failed",
            level=logging.WARNING,
            path=request.url.path,
            method=request.method,
        )
        return _redirect_with_error("Google user profile fetch failed")

    profile = user_resp.json()
    app_token = create_access_token(
        {
            "sub": str(profile.get("sub", "")),
            "name": profile.get("name", ""),
            "email": profile.get("email", ""),
            "provider": "google",
        }
    )

    next_path = _sanitize_next_path(state_data.get("next", "/"))
    log_security_event(
        "oauth_google_login_success",
        path=request.url.path,
        method=request.method,
        user_sub=str(profile.get("sub", "")),
        next_path=next_path,
    )
    target = f"{_frontend_callback_url()}?{urlencode({'token': app_token, 'next': next_path})}"
    return RedirectResponse(url=target, status_code=302)


@router.get("/github/login")
def github_login(
    request: Request,
    next_path: str = Query(default="/", alias="next"),
    _rate_limit: None = Depends(oauth_start_rate_limit),
):
    client_id = os.getenv("GITHUB_CLIENT_ID")
    redirect_uri = os.getenv("GITHUB_REDIRECT_URI")
    if not client_id or not redirect_uri:
        raise HTTPException(status_code=500, detail="GitHub OAuth is not configured.")

    safe_next = _sanitize_next_path(next_path)
    state = create_oauth_state("github", next_path=safe_next)
    log_security_event(
        "oauth_github_login_started",
        path=request.url.path,
        method=request.method,
        next_path=safe_next,
    )
    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "scope": "read:user user:email",
        "state": state,
    }
    url = f"https://github.com/login/oauth/authorize?{urlencode(params)}"
    return RedirectResponse(url=url, status_code=302)


@router.get("/github/callback")
def github_callback(
    request: Request,
    code: str | None = None,
    state: str | None = None,
    _rate_limit: None = Depends(oauth_callback_rate_limit),
):
    if not code or not state:
        log_security_event(
            "oauth_github_callback_missing_fields",
            level=logging.WARNING,
            path=request.url.path,
            method=request.method,
        )
        return _redirect_with_error("Missing OAuth code or state")

    try:
        state_data = decode_token(state)
    except HTTPException:
        log_security_event(
            "oauth_github_invalid_state",
            level=logging.WARNING,
            path=request.url.path,
            method=request.method,
        )
        return _redirect_with_error("Invalid OAuth state")

    if state_data.get("provider") != "github":
        log_security_event(
            "oauth_github_provider_mismatch",
            level=logging.WARNING,
            path=request.url.path,
            method=request.method,
        )
        return _redirect_with_error("Invalid OAuth state")

    client_id = os.getenv("GITHUB_CLIENT_ID")
    client_secret = os.getenv("GITHUB_CLIENT_SECRET")
    redirect_uri = os.getenv("GITHUB_REDIRECT_URI")
    if not client_id or not client_secret or not redirect_uri:
        return _redirect_with_error("GitHub OAuth config missing")

    token_resp = requests.post(
        "https://github.com/login/oauth/access_token",
        data={
            "client_id": client_id,
            "client_secret": client_secret,
            "code": code,
            "redirect_uri": redirect_uri,
            "state": state,
        },
        headers={"Accept": "application/json"},
        timeout=20,
    )
    if token_resp.status_code >= 400:
        log_security_event(
            "oauth_github_token_exchange_failed",
            level=logging.WARNING,
            path=request.url.path,
            method=request.method,
        )
        return _redirect_with_error("GitHub token exchange failed")

    token_data = token_resp.json()
    access_token = token_data.get("access_token")
    if not access_token:
        log_security_event(
            "oauth_github_access_token_missing",
            level=logging.WARNING,
            path=request.url.path,
            method=request.method,
        )
        return _redirect_with_error("GitHub access token missing")

    profile_resp = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=20,
    )
    if profile_resp.status_code >= 400:
        log_security_event(
            "oauth_github_profile_failed",
            level=logging.WARNING,
            path=request.url.path,
            method=request.method,
        )
        return _redirect_with_error("GitHub user profile fetch failed")

    profile = profile_resp.json()
    email = profile.get("email") or ""
    if not email:
        email_resp = requests.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=20,
        )
        if email_resp.status_code < 400:
            emails = email_resp.json()
            if isinstance(emails, list):
                primary = next((item for item in emails if item.get("primary")), None)
                fallback = emails[0] if emails else {}
                email = str((primary or fallback).get("email", ""))

    app_token = create_access_token(
        {
            "sub": str(profile.get("id", "")),
            "name": profile.get("name") or profile.get("login") or "",
            "email": email,
            "provider": "github",
        }
    )

    next_path = _sanitize_next_path(state_data.get("next", "/"))
    log_security_event(
        "oauth_github_login_success",
        path=request.url.path,
        method=request.method,
        user_sub=str(profile.get("id", "")),
        next_path=next_path,
    )
    target = f"{_frontend_callback_url()}?{urlencode({'token': app_token, 'next': next_path})}"
    return RedirectResponse(url=target, status_code=302)


@router.get("/me")
def me(
    request: Request,
    _rate_limit: None = Depends(auth_me_rate_limit),
    user=Depends(get_current_user),
):
    log_security_event(
        "auth_me_requested",
        path=request.url.path,
        method=request.method,
        user_sub=user.get("sub"),
        provider=user.get("provider"),
    )
    return user
