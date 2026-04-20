import React from "react";

export default function OptionalNumber({ label, value, onChange, unknown, setUnknown }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
        {label}
      </label>
      <input
        value={unknown ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        disabled={unknown}
        style={{ width: "100%" }}
      />
      <label style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, fontSize: 12, color: "#6b7280" }}>
        <input type="checkbox" checked={unknown} onChange={(e) => setUnknown(e.target.checked)} />
        I don't know
      </label>
    </div>
  );
}
