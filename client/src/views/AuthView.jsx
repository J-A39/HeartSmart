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
        <div style={{ maxWidth: 520, margin: "48px auto", padding: 16, fontFamily: "Arial" }}>
            <h2 style={{ marginBottom: 8 }}>HeartSmart</h2>
            <div style={{ opacity: 0.8, marginBottom: 16 }}>
                {mode === "login" ? "Log in to continue." : "Create an account to continue."}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <button onClick={() => setMode("login")} disabled={mode === "login"}>
                    Login
                </button>
                <button onClick={() => setMode("register")} disabled={mode === "register"}>
                    Register
                </button>
            </div>

            <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
                <div>
                    <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        placeholder="you@example.com"
                        style={{ width: "100%" }}
                    />
                </div>

                <div>
                    <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>
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

                <button type="submit" disabled={loading}>
                    {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
                </button>

                {err && <div style={{ color: "crimson" }}>{err}</div>}
            </form>

            <div style={{ marginTop: 16, fontSize: 12, opacity: 0.7 }}>
                Backend must be running on {API_BASE}.
            </div>
        </div>
    );
}