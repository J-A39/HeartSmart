import React, { useEffect, useState } from "react";

export default function HistoryPage({ api, onUnauthorized }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    setLoading(true);

    try {
      const resp = await api.get(`/api/history?limit=20`);
      setHistory(resp.data);
    } catch (e) {
      const m = e?.response?.data?.error || e?.response?.data?.detail || e.message || "Failed to load history";
      setErr(m);
      if (e?.response?.status === 401) onUnauthorized();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function formatDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString() + " at " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return iso;
    }
  }

  function bandInfo(band) {
    if (!band) return { color: "#6b7280", cls: "" };
    const b = band.toLowerCase();
    if (b.includes("low")) return { color: "#16a34a", cls: "badge-green" };
    if (b.includes("moderate") || b.includes("medium")) return { color: "#d97706", cls: "badge-amber" };
    if (b.includes("high")) return { color: "#ef4444", cls: "badge-red" };
    return { color: "#6b7280", cls: "" };
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ marginBottom: 4 }}>History</h3>
          <p style={{ color: "#6b7280", fontSize: 14 }}>Your past risk assessments and snapshots.</p>
        </div>
        <button className="secondary" onClick={load} disabled={loading} style={{ fontSize: 13 }}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {err && <div style={{ color: "#ef4444", marginBottom: 12, fontSize: 14 }}>{err}</div>}

      <div style={{ display: "grid", gap: 10 }}>
        {Array.isArray(history) && history.length === 0 && (
          <div className="card" style={{ textAlign: "center", color: "#6b7280", padding: 40 }}>
            No assessments recorded yet. Complete a risk assessment to see it here.
          </div>
        )}

        {Array.isArray(history) &&
          history.map((row) => {
            const risk = row.rawMlResponse?.risk;
            const band = row.rawMlResponse?.risk_band;
            const bi = bandInfo(band);

            return (
              <div key={row._id || row.createdAt} className="history-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{formatDate(row.createdAt)}</div>
                  {band && (
                    <span className={`badge ${bi.cls}`}>{band}</span>
                  )}
                </div>

                <div style={{ display: "flex", gap: 24, alignItems: "baseline", marginBottom: 10 }}>
                  <div>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>Risk </span>
                    <span style={{ fontSize: 20, fontWeight: 700, color: bi.color }}>
                      {risk != null ? (risk * 100).toFixed(1) + "%" : "—"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#4b5563" }}>
                  <div>
                    <span style={{ color: "#9ca3af" }}>Medicines: </span>
                    {Array.isArray(row.medications) && row.medications.length > 0
                      ? row.medications.map((m) => `${m.name}${m.dose ? " (" + m.dose + ")" : ""}`).join(", ")
                      : "None recorded"}
                  </div>
                </div>

                <div style={{ fontSize: 13, color: "#4b5563", marginTop: 4 }}>
                  <span style={{ color: "#9ca3af" }}>Exercises: </span>
                  {Array.isArray(row.exercises) && row.exercises.length > 0
                    ? row.exercises.map((e) => `${e.type}${e.durationMinutes ? " " + e.durationMinutes + "min" : ""}`).join(", ")
                    : "None recorded"}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
