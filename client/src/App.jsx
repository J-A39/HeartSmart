import React, { useEffect, useMemo, useState } from "react";
import { makeApi } from "./api";

import AuthView from "./views/AuthView";
import AssessmentPage from "./pages/AssessmentPage";
import LogbookPage from "./pages/LogbookPage";
import HistoryPage from "./pages/HistoryPage";
import KnowledgePage from "./pages/KnowledgePage";
import SettingsPage from "./pages/SettingsPage";

const tabs = [
  { key: "assessment", label: "Assessment", icon: "♡" },
  { key: "logbook", label: "Logbook", icon: "✎" },
  { key: "history", label: "History", icon: "⏱" },
  { key: "knowledge", label: "Knowledge", icon: "📖" },
  { key: "settings", label: "Settings", icon: "⚙" },
];

function getStoredTheme() {
  try {
    return localStorage.getItem("theme") || "light";
  } catch {
    return "light";
  }
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const api = useMemo(() => makeApi(token), [token]);

  const [tab, setTab] = useState("assessment");
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

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
    return <AuthView onToken={onToken} theme={theme} toggleTheme={toggleTheme} />;
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
          <button className="theme-toggle" onClick={toggleTheme}>
            <span className="nav-icon">{theme === "light" ? "🌙" : "☀️"}</span>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
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
        {tab === "settings" && <SettingsPage api={api} onUnauthorized={handleUnauthorized} onAccountDeleted={logout} />}
      </main>
    </div>
  );
}
