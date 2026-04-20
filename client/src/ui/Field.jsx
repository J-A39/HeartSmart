import React from "react";

export default function Field({ label, value, onChange }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
        {label}
      </label>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%" }} />
    </div>
  );
}
