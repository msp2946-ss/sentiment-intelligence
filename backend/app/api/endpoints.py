from fastapi import APIRouter, HTTPException, UploadFile, File
from backend.app.api.models import SentimentRequest, SentimentResponse, BulkSentimentRequest, BulkSentimentResponse
from backend.app.model.predict import predict_sentiment
import pandas as pd
import io

router = APIRouter()

@router.post("/predict", response_model=SentimentResponse)
async def predict(request: SentimentRequest):
    try:
        result = predict_sentiment(request.text)
        return SentimentResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict-bulk", response_model=BulkSentimentResponse)
async def predict_bulk(request: BulkSentimentRequest):
    results = []
    for text in request.texts:
        try:
            res = predict_sentiment(text)
            results.append(SentimentResponse(**res))
        except Exception:
            results.append(SentimentResponse(sentiment="Error", confidence=0.0, probabilities={}))
    return BulkSentimentResponse(results=results)

@router.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV.")
    
    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        if 'text' not in df.columns:
             raise HTTPException(status_code=400, detail="CSV must contain a 'text' column.")
        
        results = []
        for text in df['text'].fillna('').astype(str):
            res = predict_sentiment(text)
            results.append(res)
        
        return {"filename": file.filename, "total_processed": len(results), "preview": results[:5]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
