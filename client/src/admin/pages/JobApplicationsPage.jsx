import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Trash2, Mail, Phone, ExternalLink, MessageSquare } from "lucide-react";
import { apiClient } from "../../api/apiClient";
import { DataTable } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../context/ToastContext";

const STATUS_COLORS = {
  new: { bg: "#e5f5fa", color: "#0073aa", border: "#0073aa" },
  reviewed: { bg: "#fff8e5", color: "#996800", border: "#cca200" },
  shortlisted: { bg: "#edfaef", color: "#00a32a", border: "#4ab866" },
  rejected: { bg: "#fcf0f1", color: "#d63638", border: "#e68a8c" },
};

export function JobApplicationsPage() {
  const { id } = useParams(); // Job ID
  const navigate = useNavigate();
  const toast = useToast();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedNote, setSelectedNote] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { q: search }),
        ...(statusFilter && { status: statusFilter }),
      });
      const endpoint = id ? `/api/admin/jobs/${id}/applications?${params}` : `/api/admin/applications?${params}`;
      const res = await apiClient.get(endpoint);

      if (res.job) setJob(res.job);
      setApplications(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch (err) {
      toast.error(err.message || "Failed to load job applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [id, page, search, statusFilter]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await apiClient.put(`/api/admin/applications/${applicationId}/status`, { status: newStatus });
      toast.success(`Application status updated to "${newStatus}".`);
      fetchApplications();
    } catch (err) {
      toast.error(err.message || "Failed to update status.");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await apiClient.delete(`/api/admin/applications/${deletingId}`);
      toast.success("Application removed successfully.");
      setDeletingId(null);
      fetchApplications();
    } catch (err) {
      toast.error(err.message || "Failed to delete application.");
    }
  };

  const columns = [
    {
      header: "Applicant Name",
      accessorKey: "name",
      cell: (row) => (
        <div>
          <strong style={{ fontSize: 14 }}>{row.name}</strong>
          <div style={{ fontSize: 12, color: "#646970", marginTop: 2, display: "flex", gap: 12 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Mail size={12} /> {row.email}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Phone size={12} /> {row.phone}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Job Role",
      accessorKey: "job",
      cell: (row) => (
        <div>
          <span style={{ fontWeight: 600 }}>{row.job?.title || job?.title || "N/A"}</span>
          <div className="admin-form-hint">{row.job?.department || job?.department || ""}</div>
        </div>
      ),
    },
    {
      header: "Resume File",
      accessorKey: "resume",
      cell: (row) =>
        row.resume?.url ? (
          <a
            href={row.resume.url}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-secondary"
            style={{ padding: "4px 8px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <FileText size={13} />
            <span>Download Resume</span>
            <ExternalLink size={11} />
          </a>
        ) : (
          <span style={{ color: "#8c8f94", fontSize: 12 }}>No Resume</span>
        ),
    },
    {
      header: "Cover Note",
      accessorKey: "coverNote",
      cell: (row) =>
        row.coverNote ? (
          <button
            type="button"
            className="admin-btn-icon"
            title="View Cover Note"
            onClick={() => setSelectedNote({ name: row.name, note: row.coverNote })}
            style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#0073aa", fontSize: 13 }}
          >
            <MessageSquare size={14} /> Read Note
          </button>
        ) : (
          <span style={{ color: "#8c8f94", fontSize: 12 }}>None</span>
        ),
    },
    {
      header: "Submitted On",
      accessorKey: "createdAt",
      cell: (row) =>
        new Date(row.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      header: "Application Status",
      accessorKey: "status",
      cell: (row) => {
        const style = STATUS_COLORS[row.status] || STATUS_COLORS.new;
        return (
          <select
            className="admin-select"
            style={{
              padding: "4px 8px",
              fontSize: 12,
              fontWeight: 600,
              backgroundColor: style.bg,
              color: style.color,
              borderColor: style.border,
              borderRadius: 4,
            }}
            value={row.status}
            onChange={(e) => handleStatusChange(row._id, e.target.value)}
          >
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>
        );
      },
    },
  ];

  return (
    <div className="admin-applications-view">
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            className="admin-btn-icon"
            onClick={() => navigate("/admin/jobs")}
            title="Back to Job Listings"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="admin-page-title">
              {job ? `Applicants for ${job.title}` : "Job Applications"}
            </h1>
            <p className="admin-page-subtitle">
              {job
                ? `${job.department} • ${job.location}`
                : "Review resumes, applicant cover notes, and manage hiring pipeline"}
            </p>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={applications}
        loading={loading}
        total={total}
        page={page}
        limit={10}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={[
          { label: "New", value: "new" },
          { label: "Reviewed", value: "reviewed" },
          { label: "Shortlisted", value: "shortlisted" },
          { label: "Rejected", value: "rejected" },
        ]}
        emptyMessage="No job applications received for this criteria yet."
        renderRowActions={(row) => (
          <div style={{ textAlign: "right" }}>
            <button
              type="button"
              className="admin-btn-icon"
              title="Delete Application"
              onClick={() => setDeletingId(row._id)}
            >
              <Trash2 size={14} color="#d63638" />
            </button>
          </div>
        )}
      />

      {/* Cover Note Modal */}
      {selectedNote && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedNote(null)}>
          <div className="admin-modal-card" style={{ maxWidth: 500, padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
              Cover Note from {selectedNote.name}
            </h3>
            <div
              style={{
                background: "#f6f7f7",
                padding: 16,
                borderRadius: 6,
                fontSize: 14,
                whiteSpace: "pre-wrap",
                color: "#2c3338",
                maxHeight: 300,
                overflowY: "auto",
              }}
            >
              {selectedNote.note}
            </div>
            <div style={{ marginTop: 20, textAlign: "right" }}>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={() => setSelectedNote(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingId && (
        <ConfirmDialog
          isOpen={!!deletingId}
          title="Delete Application Record"
          message="Are you sure you want to remove this applicant record and resume file? This action cannot be undone."
          confirmLabel="Delete Application"
          isDanger
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}
