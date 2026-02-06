import React from "react";

export default function Select({ label, value, onChange, options }) {
    return (
        <div>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>{label}</label>
            <select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%" }}>
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </div>
    );
}