from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

import pandas as pd

from risk_utils import predict_risk_with_range


def risk_band(risk: float) -> str:
    if risk < 0.05:
        return "Low"
    if risk < 0.10:
        return "Borderline"
    if risk < 0.20:
        return "Intermediate"
    return "High"


def _confidence_label(missing_fields: List[str]) -> str:
    n = len(missing_fields)
    if n == 0:
        return "High"
    if n == 1:
        return "Medium"
    return "Low"


def _clamp01(x: float) -> float:
    return max(0.0, min(1.0, float(x)))


def _counterfactual_nonsmoker_risk(
    model: Any,
    user_row: Dict[str, Any],
    features: List[str],
) -> Optional[float]:

    if "currentSmoker" not in user_row or "cigsPerDay" not in user_row:
        return None

    cf = dict(user_row)
    cf["currentSmoker"] = 0
    cf["cigsPerDay"] = 0

    X = pd.DataFrame([{f: cf.get(f, None) for f in features}], columns=features)
    return float(model.predict_proba(X)[0, 1])


def _apply_guardrails(
    *,
    model: Any,
    base_risk: float,
    low_risk: float,
    high_risk: float,
    user_row: Dict[str, Any],
    features: List[str],
) -> Tuple[float, float, float, List[str]]:

    warnings: List[str] = []
    adjusted = float(base_risk)

    glucose = user_row.get("glucose", None)
    sysBP = user_row.get("sysBP", None)
    totChol = user_row.get("totChol", None)

    if glucose is not None:
        try:
            g = float(glucose)
            if g >= 300:
                if adjusted < 0.25:
                    adjusted = 0.25
                warnings.append("Very high glucose detected; risk floor applied.")
            elif g >= 200:
                if adjusted < 0.15:
                    adjusted = 0.15
                warnings.append("High glucose detected; risk floor applied.")
        except (TypeError, ValueError):
            pass

    if sysBP is not None:
        try:
            s = float(sysBP)
            if s >= 180:
                if adjusted < 0.20:
                    adjusted = 0.20
                warnings.append("Very high systolic BP detected; risk floor applied.")
            elif s >= 160:
                if adjusted < 0.15:
                    adjusted = 0.15
                warnings.append("High systolic BP detected; risk floor applied.")
        except (TypeError, ValueError):
            pass

    if totChol is not None:
        try:
            c = float(totChol)
            if c >= 320:
                if adjusted < 0.15:
                    adjusted = 0.15
                warnings.append("Very high cholesterol detected; risk floor applied.")
        except (TypeError, ValueError):
            pass

    try:
        if int(user_row.get("currentSmoker", 0)) == 1:
            cf = _counterfactual_nonsmoker_risk(model, user_row, features)
            if cf is not None and adjusted + 1e-9 < cf:
                adjusted = cf
                warnings.append(
                    "Sanity check applied: smoker risk adjusted to be at least the non-smoker counterfactual."
                )
    except Exception:
        pass

    adjusted = _clamp01(adjusted)

    low_risk = _clamp01(min(low_risk, adjusted))
    high_risk = _clamp01(max(high_risk, adjusted))

    return adjusted, low_risk, high_risk, warnings


def predict(
    *,
    artifact: Dict[str, Any],
    user_row: Dict[str, Any],
    unknown_flags: Optional[Dict[str, bool]] = None,
) -> Dict[str, Any]:

    model = artifact["model"]
    threshold = float(artifact.get("threshold", 0.5))
    features = artifact["features"]
    plausible_values = artifact["plausible_values"]

    model_version = str(artifact.get("model_version", "v1"))
    rules_version = str(artifact.get("rules_version", "v1"))

    user_row = {f: user_row.get(f, None) for f in features}

    base_risk, low_risk, high_risk, missing_fields = predict_risk_with_range(
        model=model,
        user_input=user_row,
        feature_list=features,
        plausible_values=plausible_values,
        unknown_flags=unknown_flags or {},
    )

    adjusted_risk, low_risk, high_risk, warnings = _apply_guardrails(
        model=model,
        base_risk=base_risk,
        low_risk=low_risk,
        high_risk=high_risk,
        user_row=user_row,
        features=features,
    )

    resp: Dict[str, Any] = {
        "risk": adjusted_risk,
        "risk_band": risk_band(adjusted_risk),
        "missing_fields": list(missing_fields),
        "confidence": _confidence_label(list(missing_fields)),
        "warnings": warnings,
        "model_threshold": threshold,
        "model_version": model_version,
        "rules_version": rules_version,
    }

    if missing_fields:
        resp["range"] = {"low": low_risk, "high": high_risk}
    else:
        resp["range"] = None

    return resp