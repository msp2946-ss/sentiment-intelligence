import json
import logging
from datetime import datetime, timezone
from typing import Any


_security_logger = logging.getLogger("sentiai.security")


def _safe_json_value(value: Any) -> Any:
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    if isinstance(value, (list, tuple)):
        return [_safe_json_value(item) for item in value]
    if isinstance(value, dict):
        return {str(key): _safe_json_value(val) for key, val in value.items()}
    return str(value)


def log_security_event(event: str, level: int = logging.INFO, **fields: Any) -> None:
    payload = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "event": event,
        **{key: _safe_json_value(value) for key, value in fields.items()},
    }
    _security_logger.log(level, json.dumps(payload, separators=(",", ":")))
