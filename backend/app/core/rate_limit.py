from collections import defaultdict, deque
from threading import Lock
from time import time
from typing import Callable, Deque

from fastapi import HTTPException, Request, status

from .security_logging import log_security_event


_lock = Lock()
_request_windows: dict[str, Deque[float]] = defaultdict(deque)


def _client_identifier(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for", "")
    if forwarded_for:
        first_hop = forwarded_for.split(",", 1)[0].strip()
        if first_hop:
            return first_hop
    return request.client.host if request.client else "unknown"


def rate_limit(limit: int, window_seconds: int, scope: str) -> Callable[[Request], None]:
    def dependency(request: Request) -> None:
        now = time()
        window_start = now - window_seconds
        client = _client_identifier(request)
        key = f"{scope}:{client}"

        with _lock:
            bucket = _request_windows[key]
            while bucket and bucket[0] < window_start:
                bucket.popleft()

            if len(bucket) >= limit:
                retry_after = max(1, int(bucket[0] + window_seconds - now))
                log_security_event(
                    "rate_limit_exceeded",
                    scope=scope,
                    client=client,
                    path=request.url.path,
                    method=request.method,
                    limit=limit,
                    window_seconds=window_seconds,
                )
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many requests. Please retry shortly.",
                    headers={"Retry-After": str(retry_after)},
                )

            bucket.append(now)

    return dependency
