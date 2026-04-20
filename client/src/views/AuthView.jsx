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
      maxWidth: 400,
      margin: "80px auto",
      padding: 32,
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    }}>
      <h2 style={{ fontSize: 24, marginBottom: 4 }}>HeartSmart</h2>
      <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
        {mode === "login" ? "Log in to continue." : "Create an account to continue."}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        <button
          onClick={() => setMode("login")}
          className={mode === "login" ? undefined : "secondary"}
          style={{ flex: 1 }}
        >
          Login
        </button>
        <button
          onClick={() => setMode("register")}
          className={mode === "register" ? undefined : "secondary"}
          style={{ flex: 1 }}
        >
          Register
        </button>
      </div>

      <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
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
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
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

        <button type="submit" disabled={loading} style={{ marginTop: 4 }}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>

        {err && <div style={{ color: "#ef4444", fontSize: 14 }}>{err}</div>}
      </form>

      <div style={{ marginTop: 20, fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
        This application is not a diagnostic tool and should not replace professional medical advice.
      </div>
    </div>
  );
}
