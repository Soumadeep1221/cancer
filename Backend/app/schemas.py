from pydantic import BaseModel
from typing import List

class PredictionInput(BaseModel):
    features: List[float]  # Adjust size depending on your model's expected input

class PredictionOutput(BaseModel):
    prediction: int
    probability:float