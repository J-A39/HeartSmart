import React, { useState } from "react";

export default function SettingsPage({ api, onUnauthorized, onAccountDeleted }) {
  const [exporting, setExporting] = useState(false);
  const [exportErr, setExportErr] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteErr, setDeleteErr] = useState("");

  async function exportData() {
    setExportErr("");
    setExporting(true);

    try {
      const resp = await api.get("/api/user/export");
      const blob = new Blob([JSON.stringify(resp.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "heartsmart-export.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      const m = e?.response?.data?.error || e?.response?.data?.detail || e.message || "Export failed";
      setExportErr(m);
      if (e?.response?.status === 401) onUnauthorized();
    } finally {
      setExporting(false);
    }
  }

  async function deleteAllData() {
    setDeleteErr("");
    setDeleting(true);

    try {
      await api.delete("/api/user/data");
      onAccountDeleted();
    } catch (e) {
      const m = e?.response?.data?.error || e?.response?.data?.detail || e.message || "Deletion failed";
      setDeleteErr(m);
      if (e?.response?.status === 401) onUnauthorized();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <h3 style={{ marginBottom: 4 }}>Settings</h3>
      <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>
        Manage your data and account.
      </p>

      <div className="card" style={{ marginBottom: 12 }}>
        <h4 style={{ marginBottom: 8 }}>Export Data</h4>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 14 }}>
          Download all of your data as a JSON file. This includes your profile, logbook entries,
          risk assessment history and quiz scores.
        </p>
        <button onClick={exportData} disabled={exporting}>
          {exporting ? "Exporting..." : "Download My Data"}
        </button>
        {exportErr && <div style={{ color: "#ef4444", fontSize: 14, marginTop: 8 }}>{exportErr}</div>}
      </div>

      <div className="card" style={{ border: "1px solid var(--badge-red-bg)" }}>
        <h4 style={{ marginBottom: 8, color: "#ef4444" }}>Delete Account & Data</h4>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 14 }}>
          Permanently delete your account and all associated data. This includes your logbook,
          risk assessment history, quiz scores and your account. This action cannot be undone.
        </p>

        {!confirmDelete ? (
          <button className="danger" onClick={() => setConfirmDelete(true)}>
            Delete All My Data
          </button>
        ) : (
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#ef4444", marginBottom: 12 }}>
              Are you sure? This will permanently delete everything and log you out.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="danger" onClick={deleteAllData} disabled={deleting}>
                {deleting ? "Deleting..." : "Yes, Delete Everything"}
              </button>
              <button className="secondary" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                Cancel
              </button>
            </div>
          </div>
        )}
        {deleteErr && <div style={{ color: "#ef4444", fontSize: 14, marginTop: 8 }}>{deleteErr}</div>}
      </div>
    </div>
  );
}
