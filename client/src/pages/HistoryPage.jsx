import React, { useEffect, useState } from "react";

const card = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  padding: 20,
  borderRadius: 10,
};

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
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>History</h3>
        <button className="secondary" onClick={load} disabled={loading} style={{ fontSize: 13 }}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {err && <div style={{ color: "#ef4444", marginTop: 8, fontSize: 14 }}>{err}</div>}

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {Array.isArray(history) && history.length === 0 && (
          <div style={{ color: "#6b7280", fontSize: 14 }}>No records yet.</div>
        )}

        {Array.isArray(history) &&
          history.map((row) => (
            <div
              key={row._id || row.createdAt}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 12,
                background: "#f9fafb",
              }}
            >
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
                {formatDate(row.createdAt)}
              </div>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Risk: </span>
                  <span style={{ fontWeight: 600 }}>
                    {row.rawMlResponse?.risk != null
                      ? (row.rawMlResponse.risk * 100).toFixed(2) + "%"
                      : "—"}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Band: </span>
                  <span style={{ fontWeight: 600, color: bandColor(row.rawMlResponse?.risk_band) }}>
                    {row.rawMlResponse?.risk_band ?? "—"}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 8, fontSize: 13 }}>
                <span style={{ color: "#6b7280" }}>Medicines: </span>
                {Array.isArray(row.medications) && row.medications.length > 0
                  ? row.medications.map((m) => `${m.name}${m.dose ? " (" + m.dose + ")" : ""}`).join(", ")
                  : "—"}
              </div>

              <div style={{ marginTop: 4, fontSize: 13 }}>
                <span style={{ color: "#6b7280" }}>Exercises: </span>
                {Array.isArray(row.exercises) && row.exercises.length > 0
                  ? row.exercises.map((e) => `${e.type}${e.durationMinutes ? " " + e.durationMinutes + "min" : ""}`).join(", ")
                  : "—"}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
