from pathlib import Path
import sys
import joblib
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, Dict, Any

BASE_DIR = Path(__file__).resolve().parent
SRC_DIR = BASE_DIR / "src"
MODELS_DIR = BASE_DIR / "models"

sys.path.append(str(SRC_DIR))

from predictor import predict

artifact = joblib.load(MODELS_DIR / "heartsmart_model.pkl")

app = FastAPI(title="HeartSmart ML Service")

class RiskRequest(BaseModel):
    age: int
    male: int
    currentSmoker: int
    cigsPerDay: int
    diabetes: int
    BMI: float
    sysBP: Optional[float] = None
    totChol: Optional[float] = None
    glucose: Optional[float] = None

    unknown_flags: Dict[str, bool] = {}

@app.post("/predict")
def predict_risk(req: RiskRequest) -> Dict[str, Any]:
    user_row = {
        "age": req.age,
        "male": req.male,
        "currentSmoker": req.currentSmoker,
        "cigsPerDay": req.cigsPerDay,
        "diabetes": req.diabetes,
        "BMI": req.BMI,
        "sysBP": req.sysBP,
        "totChol": req.totChol,
        "glucose": req.glucose,
    }

    result = predict(
        artifact=artifact,
        user_row=user_row,
        unknown_flags=req.unknown_flags,
    )
    return result