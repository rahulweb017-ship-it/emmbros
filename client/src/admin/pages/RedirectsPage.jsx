import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, ArrowRight } from "lucide-react";
import { apiClient } from "../../api/apiClient";
import { DataTable } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../context/ToastContext";

export function RedirectsPage() {
  const [redirects, setRedirects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [fromUrl, setFromUrl] = useState("");
  const [toUrl, setToUrl] = useState("");
  const [statusCode, setStatusCode] = useState(301);
  const [saving, setSaving] = useState(false);

  const toast = useToast();

  const fetchRedirects = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/admin/redirects");
      setRedirects(res.data || []);
    } catch (err) {
      toast.error("Failed to load 301 URL redirects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedirects();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFromUrl("");
    setToUrl("");
    setStatusCode(301);
    setShowModal(true);
  };

  const openEditModal = (r) => {
    setEditingId(r._id);
    setFromUrl(r.fromUrl);
    setToUrl(r.toUrl);
    setStatusCode(r.statusCode || 301);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!fromUrl.trim() || !toUrl.trim()) {
      toast.error("Both Old Path and Target URL are required.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await apiClient.put(`/api/admin/redirects/${editingId}`, {
          fromUrl,
          toUrl,
          statusCode,
        });
        toast.success("Redirect rule updated successfully!");
      } else {
        await apiClient.post("/api/admin/redirects", {
          fromUrl,
          toUrl,
          statusCode,
        });
        toast.success("New 301 redirect created!");
      }
      setShowModal(false);
      fetchRedirects();
    } catch (err) {
      toast.error(err.message || "Failed to save redirect rule.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await apiClient.delete(`/api/admin/redirects/${deletingId}`);
      toast.success("Redirect rule deleted.");
      setDeletingId(null);
      fetchRedirects();
    } catch (err) {
      toast.error("Failed to delete redirect rule.");
    }
  };

  const columns = [
    {
      header: "Old URL Path (From)",
      accessorKey: "fromUrl",
      cell: (row) => <code>{row.fromUrl}</code>,
    },
    {
      header: "Target URL (To)",
      accessorKey: "toUrl",
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ArrowRight size={14} color="#8c8f94" />
          <code>{row.toUrl}</code>
        </div>
      ),
    },
    {
      header: "HTTP Code",
      accessorKey: "statusCode",
      cell: (row) => (
        <span style={{ fontWeight: 600, color: row.statusCode === 301 ? "#00a32a" : "#dba617" }}>
          {row.statusCode} Permanent
        </span>
      ),
    },
  ];

  return (
    <div className="admin-redirects-view">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">301 URL Redirects</h1>
          <p className="admin-page-subtitle">Map legacy URLs to new paths to preserve SEO backlinks and page rank</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openCreateModal}>
          <Plus size={16} />
          <span>Add New Redirect</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={redirects}
        loading={loading}
        total={redirects.length}
        emptyMessage="No 301 redirect rules configured yet. Click 'Add New Redirect' to create one."
        renderRowActions={(row) => (
          <div style={{ textAlign: "right", display: "flex", gap: 6, justifyContent: "flex-end" }}>
            <button type="button" className="admin-btn-icon" title="Edit Redirect" onClick={() => openEditModal(row)}>
              <Edit size={14} />
            </button>
            <button type="button" className="admin-btn-icon" title="Delete Redirect" onClick={() => setDeletingId(row._id)}>
              <Trash2 size={14} color="#d63638" />
            </button>
          </div>
        )}
      />

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="admin-modal-card" style={{ maxWidth: 480, padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
              {editingId ? "Edit 301 Redirect Rule" : "Add 301 URL Redirect Rule"}
            </h3>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>
                  Old URL Path (From)
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. /old-company-news.html or /about-us"
                  value={fromUrl}
                  onChange={(e) => setFromUrl(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>
                  Target Destination URL (To)
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. /blog/company-news or /who-we-are"
                  value={toUrl}
                  onChange={(e) => setToUrl(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>
                  Redirect Type
                </label>
                <select className="admin-select" value={statusCode} onChange={(e) => setStatusCode(Number(e.target.value))}>
                  <option value={301}>301 Permanent Redirect (Preserves SEO)</option>
                  <option value={302}>302 Temporary Redirect</option>
                </select>
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Redirect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingId && (
        <ConfirmDialog
          isOpen={!!deletingId}
          title="Delete Redirect Rule"
          message="Are you sure you want to remove this 301 redirect mapping?"
          confirmLabel="Delete Rule"
          isDanger
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}
