import React, { useMemo, useState } from "react";
import { makeApi } from "./api";

import AuthView from "./views/AuthView";
import AssessmentPage from "./pages/AssessmentPage";
import LogbookPage from "./pages/LogbookPage";
import HistoryPage from "./pages/HistoryPage";
import KnowledgePage from "./pages/KnowledgePage";

const tabs = [
  { key: "assessment", label: "Assessment", icon: "♡" },
  { key: "logbook", label: "Logbook", icon: "✎" },
  { key: "history", label: "History", icon: "⏱" },
  { key: "knowledge", label: "Knowledge", icon: "📖" },
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
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>HeartSmart</h2>
          <span>CAD Risk & Knowledge</span>
        </div>

        <nav className="sidebar-nav">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`nav-item ${tab === t.key ? "active" : ""}`}
            >
              <span className="nav-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={logout}>
            <span className="nav-icon">↩</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        {tab === "assessment" && <AssessmentPage api={api} onUnauthorized={handleUnauthorized} />}
        {tab === "logbook" && <LogbookPage api={api} onUnauthorized={handleUnauthorized} />}
        {tab === "history" && <HistoryPage api={api} onUnauthorized={handleUnauthorized} />}
        {tab === "knowledge" && <KnowledgePage api={api} onUnauthorized={handleUnauthorized} />}
      </main>
    </div>
  );
}
