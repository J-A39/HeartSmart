import React, { useMemo, useState } from "react";
import { makeApi } from "./api";

import AuthView from "./views/AuthView";
import AssessmentPage from "./pages/AssessmentPage";
import LogbookPage from "./pages/LogbookPage";
import HistoryPage from "./pages/HistoryPage";
import KnowledgePage from "./pages/KnowledgePage";

const tabs = [
  { key: "assessment", label: "Assessment" },
  { key: "logbook", label: "Logbook" },
  { key: "history", label: "History" },
  { key: "knowledge", label: "Knowledge" },
];

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const api = useMemo(() => makeApi(token), [token]);

  const [tab, setTab] = useState("assessment");

  function onToken(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setTab("assessment");
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setTab("assessment");
  }

  function handleUnauthorized() {
    logout();
  }

  if (!token) {
    return <AuthView onToken={onToken} />;
  }

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingBottom: 16,
        borderBottom: "1px solid #e5e7eb",
      }}>
        <div>
          <h2 style={{ fontSize: 22 }}>HeartSmart</h2>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
            Coronary Artery Disease — Risk & Knowledge
          </div>
        </div>
        <button className="secondary" onClick={logout} style={{ fontSize: 13 }}>
          Logout
        </button>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={tab === t.key ? undefined : "secondary"}
            style={{ fontSize: 13 }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "assessment" && <AssessmentPage api={api} onUnauthorized={handleUnauthorized} />}
      {tab === "logbook" && <LogbookPage api={api} onUnauthorized={handleUnauthorized} />}
      {tab === "history" && <HistoryPage api={api} onUnauthorized={handleUnauthorized} />}
      {tab === "knowledge" && <KnowledgePage api={api} onUnauthorized={handleUnauthorized} />}
    </div>
  );
}
