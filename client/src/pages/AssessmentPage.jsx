import React, { useMemo, useState } from "react";
import Field from "../ui/Field";
import Select from "../ui/Select";
import OptionalNumber from "../ui/OptionalNumber";

function toNumOrNull(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

const card = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  padding: 20,
  borderRadius: 10,
};

export default function AssessmentPage({ api, onUnauthorized }) {
  const [form, setForm] = useState({
    age: "45",
    male: "1",
    currentSmoker: "0",
    cigsPerDay: "10",
    diabetes: "0",
    BMI: "28.0",
    sysBP: "120",
    totChol: "200",
    glucose: "90",
  });

  const [unknown, setUnknown] = useState({
    sysBP: false,
    totChol: false,
    glucose: false,
    cigsPerDay: false,
  });

  const [result, setResult] = useState(null);
  const [submitErr, setSubmitErr] = useState("");
  const [loading, setLoading] = useState(false);

  const isSmoker = form.currentSmoker === "1";

  function onChange(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function setUnknownFlag(k, v) {
    setUnknown((p) => ({ ...p, [k]: v }));
  }

  const payload = useMemo(() => {
    return {
      age: Number(form.age),
      male: Number(form.male),
      currentSmoker: Number(form.currentSmoker),
      cigsPerDay: isSmoker ? Number(form.cigsPerDay || 10) : 0,
      diabetes: Number(form.diabetes),
      BMI: Number(form.BMI),
      sysBP: unknown.sysBP ? null : toNumOrNull(form.sysBP),
      totChol: unknown.totChol ? null : toNumOrNull(form.totChol),
      glucose: unknown.glucose ? null : toNumOrNull(form.glucose),
      unknown_flags: {
        sysBP: !!unknown.sysBP,
        totChol: !!unknown.totChol,
        glucose: !!unknown.glucose,
        cigsPerDay: isSmoker ? !!unknown.cigsPerDay : false,
      },
    };
  }, [form, unknown, isSmoker]);

  async function submitRisk() {
    setSubmitErr("");
    setResult(null);
    setLoading(true);

    try {
      const resp = await api.post(`/api/risk`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setResult(resp.data);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err.message ||
        "Request failed";
      setSubmitErr(msg);
      if (err?.response?.status === 401) onUnauthorized();
    } finally {
      setLoading(false);
    }
  }

  function bandColor(band) {
    if (!band) return "#6b7280";
    const b = band.toLowerCase();
    if (b.includes("low")) return "#16a34a";
    if (b.includes("moderate") || b.includes("medium")) return "#d97706";
    if (b.includes("high")) return "#ef4444";
    return "#6b7280";
  }

  return (
    <section style={card}>
      <h3 style={{ marginBottom: 16 }}>Risk Assessment</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        <Field label="Age" value={form.age} onChange={(v) => onChange("age", v)} />

        <Select
          label="Sex"
          value={form.male}
          onChange={(v) => onChange("male", v)}
          options={[
            { label: "Female", value: "0" },
            { label: "Male", value: "1" },
          ]}
        />

        <Select
          label="Diabetes"
          value={form.diabetes}
          onChange={(v) => onChange("diabetes", v)}
          options={[
            { label: "No", value: "0" },
            { label: "Yes", value: "1" },
          ]}
        />

        <Field label="BMI" value={form.BMI} onChange={(v) => onChange("BMI", v)} />

        <Select
          label="Current Smoker"
          value={form.currentSmoker}
          onChange={(v) => onChange("currentSmoker", v)}
          options={[
            { label: "No", value: "0" },
            { label: "Yes", value: "1" },
          ]}
        />

        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
            Cigarettes / day
          </label>
          <input
            value={isSmoker ? form.cigsPerDay : "0"}
            onChange={(e) => onChange("cigsPerDay", e.target.value)}
            disabled={!isSmoker || unknown.cigsPerDay}
            style={{ width: "100%" }}
          />
          {isSmoker && (
            <label style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, fontSize: 12, color: "#6b7280" }}>
              <input
                type="checkbox"
                checked={unknown.cigsPerDay}
                onChange={(e) => setUnknownFlag("cigsPerDay", e.target.checked)}
              />
              I don't know (default 10/day)
            </label>
          )}
        </div>

        <OptionalNumber
          label="Systolic BP"
          value={form.sysBP}
          unknown={unknown.sysBP}
          setUnknown={(v) => setUnknownFlag("sysBP", v)}
          onChange={(v) => onChange("sysBP", v)}
        />

        <OptionalNumber
          label="Total Cholesterol"
          value={form.totChol}
          unknown={unknown.totChol}
          setUnknown={(v) => setUnknownFlag("totChol", v)}
          onChange={(v) => onChange("totChol", v)}
        />

        <OptionalNumber
          label="Glucose"
          value={form.glucose}
          unknown={unknown.glucose}
          setUnknown={(v) => setUnknownFlag("glucose", v)}
          onChange={(v) => onChange("glucose", v)}
        />
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={submitRisk} disabled={loading}>
          {loading ? "Calculating..." : "Calculate Risk"}
        </button>
        {submitErr && <span style={{ color: "#ef4444", fontSize: 14 }}>{submitErr}</span>}
      </div>

      {result && (
        <div style={{
          marginTop: 16,
          padding: 16,
          background: "#f9fafb",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
        }}>
          <h3 style={{ marginBottom: 12 }}>Result</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Risk Score</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>
                {(result.risk * 100).toFixed(2)}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Risk Band</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: bandColor(result.risk_band) }}>
                {result.risk_band}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Confidence</div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{result.confidence}</div>
            </div>
            {result.range && (
              <div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Range</div>
                <div style={{ fontSize: 16, fontWeight: 500 }}>
                  {(result.range.low * 100).toFixed(2)}% – {(result.range.high * 100).toFixed(2)}%
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
