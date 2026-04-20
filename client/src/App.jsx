import React, { useMemo, useState } from "react";
import { makeApi } from "./api";

import AuthView from "./views/AuthView";
import AssessmentPage from "./pages/AssessmentPage";
import LogbookPage from "./pages/LogbookPage";
import HistoryPage from "./pages/HistoryPage";
import KnowledgePage from "./pages/KnowledgePage";

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
    <div style={{ maxWidth: 980, margin: "24px auto", padding: 16, fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>HeartSmart</h2>
          <div style={{ fontSize: 12, opacity: 0.75 }}>Authenticated session</div>
        </div>
        <button onClick={logout}>Logout</button>
      </div>

      <div style={{ display: "flex", gap: 8, margin: "16px 0" }}>
        <button onClick={() => setTab("assessment")} disabled={tab === "assessment"}>
          Assessment
        </button>
        <button onClick={() => setTab("logbook")} disabled={tab === "logbook"}>
          Logbook
        </button>
        <button onClick={() => setTab("history")} disabled={tab === "history"}>
          History
        </button>
        <button onClick={() => setTab("knowledge")} disabled={tab === "knowledge"}>
          Knowledge
        </button>
      </div>

      {tab === "assessment" && <AssessmentPage api={api} onUnauthorized={handleUnauthorized} />}
      {tab === "logbook" && <LogbookPage api={api} onUnauthorized={handleUnauthorized} />}
      {tab === "history" && <HistoryPage api={api} onUnauthorized={handleUnauthorized} />}
      {tab === "knowledge" && <KnowledgePage api={api} onUnauthorized={handleUnauthorized} />}
    </div>
  );
}