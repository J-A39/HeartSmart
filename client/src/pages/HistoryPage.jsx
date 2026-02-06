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

    return (
        <section style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>History</h3>
                <button onClick={load} disabled={loading}>
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>

            {err && <div style={{ color: "crimson", marginTop: 8 }}>{err}</div>}

            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                {Array.isArray(history) && history.length === 0 && <div>No records yet.</div>}

                {Array.isArray(history) &&
                    history.map((row) => (
                        <div key={row._id || row.createdAt} style={{ border: "1px solid #eee", borderRadius: 8, padding: 10 }}>
                            <div style={{ fontSize: 12, opacity: 0.8 }}>{row.createdAt}</div>

                            <div>
                                <b>Risk:</b>{" "}
                                {row.rawMlResponse?.risk != null ? (row.rawMlResponse.risk * 100).toFixed(2) + "%" : "—"}{" "}
                                <span style={{ marginLeft: 8 }}>
                                    <b>Band:</b> {row.rawMlResponse?.risk_band ?? "—"}
                                </span>
                            </div>

                            <div style={{ marginTop: 6 }}>
                                <b>Medicines:</b>{" "}
                                {Array.isArray(row.medications) && row.medications.length > 0
                                    ? row.medications.map((m) => `${m.name}${m.dose ? " (" + m.dose + ")" : ""}`).join(", ")
                                    : "—"}
                            </div>

                            <div style={{ marginTop: 6 }}>
                                <b>Exercises:</b>{" "}
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