from fastapi import FastAPI
from app.model_loader import get_model
from app.schemas import PredictionInput, PredictionOutput
import numpy as np

app = FastAPI(title="Breast Cancer Prediction API")

@app.post("/predict", response_model=PredictionOutput)
def predict(input_data: PredictionInput):
    model = get_model()
    features = np.array(input_data.features).reshape(1, -1)
    probabilities = model.predict(features)[0]
    predicted_class = int(np.argmax(probabilities))
    confidence = float(np.max(probabilities))
    return PredictionOutput(prediction=predicted_class, probability=confidence)