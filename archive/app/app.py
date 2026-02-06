import sys
from pathlib import Path

import streamlit as st
import joblib

PROJECT_ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = PROJECT_ROOT / "src"
sys.path.append(str(SRC_DIR))

from predictor import predict  # NEW: single entry point

st.set_page_config(page_title="HeartSmart", layout="centered")


@st.cache_resource
def load_artifact():
    model_path = PROJECT_ROOT / "models" / "heartsmart_model.pkl"
    return joblib.load(model_path)


artifact = load_artifact()

st.title("HeartSmart — 10-Year CHD Risk")
st.caption("Educational tool — not medical advice.")

with st.expander("What this tool does (and doesn't do)", expanded=False):
    st.write(
        "- Estimates 10-year coronary heart disease (CHD) risk using a trained model.\n"
        "- If you skip key measurements, it shows a range based on plausible values.\n"
        "- This is not a diagnosis. If you’re concerned, speak to a healthcare professional."
    )

st.subheader("Your details")

age = st.number_input("Age", min_value=18, max_value=100, value=45, step=1)

sex = st.selectbox("Sex", ["Female", "Male"])
male = 1 if sex == "Male" else 0

current_smoker_choice = st.selectbox("Do you currently smoke?", ["No", "Yes"])
currentSmoker = 1 if current_smoker_choice == "Yes" else 0

# Smoking amount logic:
# - If smoker and unknown cigs/day, we DO NOT pass None to the model.
# - Instead we use a conservative default for the base prediction (10/day),
#   while still treating it as "unknown" for the uncertainty range.
cigs_unknown = False
if currentSmoker == 1:
    cigs_unknown = st.checkbox("I don't know cigarettes per day", value=False)
    if cigs_unknown:
        cigsPerDay_for_model = 10
        st.caption("Using 10 cigarettes/day for the estimate. The range reflects uncertainty.")
        cigsPerDay = cigsPerDay_for_model
    else:
        cigsPerDay = st.number_input("Cigarettes per day", min_value=0, max_value=80, value=10, step=1)
else:
    cigsPerDay = 0

diabetes_choice = st.selectbox("Diabetes?", ["No", "Yes"])
diabetes = 1 if diabetes_choice == "Yes" else 0

BMI = st.number_input("BMI", min_value=10.0, max_value=60.0, value=28.0, step=0.1)

st.subheader("Optional clinical measurements")

col1, col2 = st.columns(2)

with col1:
    sysbp_unknown = st.checkbox("I don't know systolic BP (sysBP)", value=False)
    sysBP = None if sysbp_unknown else st.number_input(
        "Systolic blood pressure (mmHg)", min_value=70, max_value=250, value=120, step=1
    )

    chol_unknown = st.checkbox("I don't know total cholesterol (totChol)", value=False)
    totChol = None if chol_unknown else st.number_input(
        "Total cholesterol (mg/dL)", min_value=80, max_value=500, value=200, step=1
    )

with col2:
    glucose_unknown = st.checkbox("I don't know glucose", value=False)
    glucose = None if glucose_unknown else st.number_input(
        "Glucose (mg/dL)", min_value=40, max_value=400, value=90, step=1
    )

st.divider()

if st.button("Calculate Risk"):
    user_row = {
        "age": age,
        "male": male,
        "currentSmoker": currentSmoker,
        "cigsPerDay": cigsPerDay,  # never None
        "diabetes": diabetes,
        "BMI": BMI,
        "sysBP": sysBP,
        "totChol": totChol,
        "glucose": glucose,
    }

    unknown_flags = {
        "cigsPerDay": (currentSmoker == 1 and cigs_unknown),
    }

    result = predict(artifact=artifact, user_row=user_row, unknown_flags=unknown_flags)

    st.subheader(f"Estimated 10-year CHD risk: {result['risk']*100:.1f}%")
    st.write(f"Risk category: **{result['risk_band']}**")
    st.caption(f"Prediction confidence: {result['confidence']}")

    if result["warnings"]:
        for w in result["warnings"]:
            st.warning(w)

    if result["missing_fields"]:
        r = result["range"]
        st.caption(f"Range (depends on missing inputs): {r['low']*100:.1f}% – {r['high']*100:.1f}%")
        st.info("Missing/unknown inputs: " + ", ".join(result["missing_fields"]))

    st.caption(f"Model alert threshold (best_f1): {result['model_threshold']*100:.1f}%")
    if result["risk"] >= result["model_threshold"]:
        st.warning("Elevated risk estimate based on the information provided.")
    else:
        st.success("Lower risk estimate based on the information provided.")

    st.caption(f"Model version: {result['model_version']} • Rules version: {result['rules_version']}")
    st.caption("If you're concerned about your heart health, consider speaking to a healthcare professional.")