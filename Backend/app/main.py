from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.model_loader import get_model
from app.schemas import PredictionInput, PredictionOutput
import numpy as np

app = FastAPI(title="Breast Cancer Prediction API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Breast Cancer Prediction API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API is operational"}

@app.post("/predict", response_model=PredictionOutput)
def predict(input_data: PredictionInput):
    try:
        model = get_model()
        features = np.array(input_data.features).reshape(1, -1)
        probabilities = model.predict(features)[0]
        predicted_class = int(np.argmax(probabilities))
        confidence = float(np.max(probabilities))
        return PredictionOutput(prediction=predicted_class, probability=confidence)
    except Exception as e:
        # Print error to console and return HTTP 500 with message
        print("🔥 Internal error:", e)
        raise HTTPException(status_code=500, detail=str(e))
