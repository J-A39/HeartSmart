import React, { useEffect, useState } from "react";

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

export default function LogbookPage({ api, onUnauthorized }) {
  const [logbook, setLogbook] = useState({
    medications: [{ name: "", dose: "", frequency: "", notes: "" }],
    exercises: [{ type: "", durationMinutes: "", sessionsPerWeek: "", notes: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    setErr("");
    setMsg("");
    setLoading(true);

    try {
      const resp = await api.get(`/api/logbook`);
      const meds = Array.isArray(resp.data?.medications) ? resp.data.medications : [];
      const exs = Array.isArray(resp.data?.exercises) ? resp.data.exercises : [];

      setLogbook({
        medications: meds.length ? meds : [{ name: "", dose: "", frequency: "", notes: "" }],
        exercises: exs.length ? exs : [{ type: "", durationMinutes: "", sessionsPerWeek: "", notes: "" }],
      });
    } catch (e) {
      const m = e?.response?.data?.error || e?.response?.data?.detail || e.message || "Failed to load logbook";
      setErr(m);
      if (e?.response?.status === 401) onUnauthorized();
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setErr("");
    setMsg("");
    setSaving(true);

    try {
      const medications = (logbook.medications || [])
        .map((m) => ({
          name: (m.name || "").trim(),
          dose: (m.dose || "").trim(),
          frequency: (m.frequency || "").trim(),
          notes: (m.notes || "").trim(),
        }))
        .filter((m) => m.name.length > 0);

      const exercises = (logbook.exercises || [])
        .map((e) => ({
          type: (e.type || "").trim(),
          durationMinutes: toNumOrNull(e.durationMinutes),
          sessionsPerWeek: toNumOrNull(e.sessionsPerWeek),
          notes: (e.notes || "").trim(),
        }))
        .filter((e) => e.type.length > 0);

      const resp = await api.put(`/api/logbook`, { medications, exercises });
      const meds = Array.isArray(resp.data?.medications) ? resp.data.medications : medications;
      const exs = Array.isArray(resp.data?.exercises) ? resp.data.exercises : exercises;

      setLogbook({
        medications: meds.length ? meds : [{ name: "", dose: "", frequency: "", notes: "" }],
        exercises: exs.length ? exs : [{ type: "", durationMinutes: "", sessionsPerWeek: "", notes: "" }],
      });

      setMsg("Saved");
      setTimeout(() => setMsg(""), 1500);
    } catch (e) {
      const m = e?.response?.data?.error || e?.response?.data?.detail || e.message || "Failed to save logbook";
      setErr(m);
      if (e?.response?.status === 401) onUnauthorized();
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function updateMedication(i, k, v) {
    setLogbook((p) => ({
      ...p,
      medications: p.medications.map((m, idx) => (idx === i ? { ...m, [k]: v } : m)),
    }));
  }

  function addMedication() {
    setLogbook((p) => ({
      ...p,
      medications: [...p.medications, { name: "", dose: "", frequency: "", notes: "" }],
    }));
  }

  function removeMedication(i) {
    setLogbook((p) => ({
      ...p,
      medications: p.medications.filter((_, idx) => idx !== i),
    }));
  }

  function updateExercise(i, k, v) {
    setLogbook((p) => ({
      ...p,
      exercises: p.exercises.map((e, idx) => (idx === i ? { ...e, [k]: v } : e)),
    }));
  }

  function addExercise() {
    setLogbook((p) => ({
      ...p,
      exercises: [...p.exercises, { type: "", durationMinutes: "", sessionsPerWeek: "", notes: "" }],
    }));
  }

  function removeExercise(i) {
    setLogbook((p) => ({
      ...p,
      exercises: p.exercises.filter((_, idx) => idx !== i),
    }));
  }

  return (
    <section style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Logbook</h3>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {msg && <span style={{ color: "#16a34a", fontSize: 13 }}>{msg}</span>}
          {err && <span style={{ color: "#ef4444", fontSize: 13 }}>{err}</span>}
          <button className="secondary" onClick={load} disabled={loading} style={{ fontSize: 13 }}>
            {loading ? "Loading..." : "Reload"}
          </button>
          <button onClick={save} disabled={saving || loading} style={{ fontSize: 13 }}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h4 style={{ marginBottom: 10 }}>Medicines</h4>
        {logbook.medications.map((m, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 2fr auto",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <input placeholder="Name" value={m.name} onChange={(e) => updateMedication(i, "name", e.target.value)} />
            <input placeholder="Dose" value={m.dose} onChange={(e) => updateMedication(i, "dose", e.target.value)} />
            <input placeholder="Frequency" value={m.frequency} onChange={(e) => updateMedication(i, "frequency", e.target.value)} />
            <input placeholder="Notes" value={m.notes} onChange={(e) => updateMedication(i, "notes", e.target.value)} />
            <button
              className="danger"
              onClick={() => removeMedication(i)}
              disabled={logbook.medications.length === 1}
              style={{ fontSize: 13 }}
            >
              Remove
            </button>
          </div>
        ))}
        <button className="secondary" onClick={addMedication} style={{ fontSize: 13 }}>
          + Add medicine
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h4 style={{ marginBottom: 10 }}>Exercises</h4>
        {logbook.exercises.map((ex, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 2fr auto",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <input placeholder="Type" value={ex.type} onChange={(e) => updateExercise(i, "type", e.target.value)} />
            <input placeholder="Minutes" value={ex.durationMinutes ?? ""} onChange={(e) => updateExercise(i, "durationMinutes", e.target.value)} />
            <input placeholder="Sessions/week" value={ex.sessionsPerWeek ?? ""} onChange={(e) => updateExercise(i, "sessionsPerWeek", e.target.value)} />
            <input placeholder="Notes" value={ex.notes} onChange={(e) => updateExercise(i, "notes", e.target.value)} />
            <button
              className="danger"
              onClick={() => removeExercise(i)}
              disabled={logbook.exercises.length === 1}
              style={{ fontSize: 13 }}
            >
              Remove
            </button>
          </div>
        ))}
        <button className="secondary" onClick={addExercise} style={{ fontSize: 13 }}>
          + Add exercise
        </button>
      </div>
    </section>
  );
}
