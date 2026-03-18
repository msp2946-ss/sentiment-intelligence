from contextlib import asynccontextmanager
import os
import logging

from fastapi import FastAPI, Request
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from .api.auth_endpoints import router as auth_router
from .api.endpoints import router
from .model.predict import load_resources


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load and warm the model once during startup.
    load_resources()
    yield


app = FastAPI(
    title="Sentiment Intelligence API",
    version="1.0.0",
    lifespan=lifespan,
)

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
security_logger = logging.getLogger("sentiai.security")
security_logger.setLevel(log_level)
if not security_logger.handlers:
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter("%(message)s"))
    security_logger.addHandler(handler)
security_logger.propagate = False

frontend_origin = os.getenv("FRONTEND_ORIGIN", "*")
app_env = os.getenv("APP_ENV", "development").strip().lower()

if app_env == "production" and frontend_origin == "*":
    raise RuntimeError("FRONTEND_ORIGIN must be configured in production.")

if frontend_origin == "*":
    allow_origins = ["*"]
    allow_credentials = False
else:
    allow_origins = [origin.strip() for origin in frontend_origin.split(",") if origin.strip()]
    allow_credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    return response

app.include_router(router, prefix="/api")
app.include_router(auth_router, prefix="/api/auth")


@app.get("/")
def root():
    return {"message": "Sentiment Intelligence API is running"}
