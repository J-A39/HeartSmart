import React from "react";

export default function OptionalNumber({ label, value, onChange, unknown, setUnknown }) {
    return (
        <div>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>{label}</label>
            <input
                value={unknown ? "" : value}
                onChange={(e) => onChange(e.target.value)}
                disabled={unknown}
                style={{ width: "100%" }}
            />
            <label style={{ display: "block", marginTop: 6, fontSize: 12 }}>
                <input type="checkbox" checked={unknown} onChange={(e) => setUnknown(e.target.checked)} /> I don’t know
            </label>
        </div>
    );
}