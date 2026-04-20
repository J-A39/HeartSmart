import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "../api";

export default function AuthView({ onToken }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const resp = await axios.post(`${API_BASE}${endpoint}`, { email, password });
      const token = resp.data?.token;
      if (!token) throw new Error("No token returned from server");
      onToken(token);
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error.message ||
        "Auth failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f0f2f5",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        padding: 36,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 26, letterSpacing: "-0.3px" }}>HeartSmart</h2>
          <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>
            Coronary Artery Disease — Risk & Knowledge
          </div>
        </div>

        <div style={{ display: "flex", gap: 0, marginBottom: 24, background: "#f3f4f6", borderRadius: 8, padding: 3 }}>
          <button
            onClick={() => setMode("login")}
            style={{
              flex: 1,
              background: mode === "login" ? "#fff" : "transparent",
              color: mode === "login" ? "#1a1a1a" : "#6b7280",
              boxShadow: mode === "login" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 500,
              padding: "8px 0",
              border: "none",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            style={{
              flex: 1,
              background: mode === "register" ? "#fff" : "transparent",
              color: mode === "register" ? "#1a1a1a" : "#6b7280",
              boxShadow: mode === "register" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 500,
              padding: "8px 0",
              border: "none",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#374151" }}>
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#374151" }}>
              Password {mode === "register" ? "(min 8 characters)" : ""}
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              style={{ width: "100%" }}
            />
          </div>

          <button type="submit" disabled={loading} style={{ marginTop: 4, padding: "11px 0" }}>
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
          </button>

          {err && <div style={{ color: "#ef4444", fontSize: 14, textAlign: "center" }}>{err}</div>}
        </form>

        <div style={{ marginTop: 24, fontSize: 11, color: "#9ca3af", textAlign: "center", lineHeight: 1.5 }}>
          This application is not a diagnostic tool and should not be a replacement for professional medical advice.
        </div>
      </div>
    </div>
  );
}
