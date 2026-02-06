from __future__ import annotations

import itertools
from typing import Dict, List, Tuple, Optional, Any

import numpy as np
import pandas as pd

OPTIONAL_FIELDS = ["sysBP", "totChol", "glucose", "cigsPerDay"]

def predict_risk_with_range(
    model: Any,
    user_input: Dict[str, Any],
    feature_list: List[str],
    plausible_values: Dict[str, List[float]],
    unknown_flags: Optional[Dict[str, bool]] = None,
) -> Tuple[float, float, float, List[str]]:

    unknown_flags = unknown_flags or {}

    X_base = pd.DataFrame([user_input], columns=feature_list)
    base_risk = float(model.predict_proba(X_base)[0, 1])

    missing_or_unknown = [c for c in OPTIONAL_FIELDS if pd.isna(X_base.loc[0, c])]

    for field, is_unknown in unknown_flags.items():
        if is_unknown and field in OPTIONAL_FIELDS and field not in missing_or_unknown:
            missing_or_unknown.append(field)

    if not missing_or_unknown:
        return base_risk, base_risk, base_risk, []

    candidates: Dict[str, List[float]] = {}

    for col in missing_or_unknown:
        if col == "cigsPerDay":
            smoker = X_base.loc[0, "currentSmoker"]
            if smoker == 0 or smoker == 0.0:
                candidates[col] = [0.0]
            else:
                candidates[col] = [float(v) for v in plausible_values.get("cigsPerDay_if_smoker", [5, 10, 20])]
        else:
            candidates[col] = [float(v) for v in plausible_values.get(col, [])]

        if not candidates[col]:
            current_val = X_base.loc[0, col]
            if pd.isna(current_val):
                candidates[col] = [0.0]
            else:
                candidates[col] = [float(current_val)]

    keys = list(candidates.keys())
    grids = [candidates[k] for k in keys]

    risks: List[float] = []
    for combo in itertools.product(*grids):
        row_try = dict(user_input)
        for k, v in zip(keys, combo):
            row_try[k] = float(v)

        X_try = pd.DataFrame([row_try], columns=feature_list)
        risks.append(float(model.predict_proba(X_try)[0, 1]))

    low_risk = float(np.min(risks))
    high_risk = float(np.max(risks))

    return base_risk, low_risk, high_risk, missing_or_unknown