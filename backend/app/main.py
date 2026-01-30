from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from backend.app.model.predict import load_resources
import nltk

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model and resources on startup
    try:
        print("Loading NLP resources...")
        nltk.download('stopwords')
        nltk.download('wordnet')
        load_resources()
        print("Model loaded.")
    except Exception as e:
        print(f"Error loading model: {e}")
    yield
    # Clean up on shutdown

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from backend.app.api.endpoints import router
app.include_router(router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Sentiment Analysis API is running"}
