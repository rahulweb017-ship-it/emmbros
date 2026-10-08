import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Users, ToggleLeft, ToggleRight } from "lucide-react";
import { apiClient } from "../../api/apiClient";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../context/ToastContext";

export function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deletingTitle, setDeletingTitle] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { q: search }),
        ...(statusFilter && { status: statusFilter }),
      });
      const res = await apiClient.get(`/api/admin/jobs?${params}`);
      setJobs(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch (err) {
      toast.error(err.message || "Failed to load job postings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, search, statusFilter]);

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === "open" ? "closed" : "open";
    try {
      await apiClient.put(`/api/admin/jobs/${job._id}`, { status: newStatus });
      toast.success(`Job status changed to "${newStatus}".`);
      fetchJobs();
    } catch (err) {
      toast.error(err.message || "Failed to update job status.");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await apiClient.delete(`/api/admin/jobs/${deletingId}`);
      toast.success(`Job "${deletingTitle}" deleted successfully.`);
      setDeletingId(null);
      fetchJobs();
    } catch (err) {
      toast.error(err.message || "Failed to delete job posting.");
    }
  };

  const columns = [
    {
      header: "Job Title",
      accessorKey: "title",
      cell: (row) => (
        <div>
          <strong style={{ fontSize: 15 }}>
            <Link to={`/admin/jobs/${row._id}`} style={{ color: "var(--admin-primary)", textDecoration: "none" }}>
              {row.title}
            </Link>
          </strong>
          <div className="admin-form-hint">/{row.slug}</div>
        </div>
      ),
    },
    { header: "Department", accessorKey: "department" },
    { header: "Location", accessorKey: "location" },
    { header: "Type", accessorKey: "employmentType" },
    {
      header: "Apply By",
      accessorKey: "applyByDate",
      cell: (row) =>
        row.applyByDate
          ? new Date(row.applyByDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "No deadline",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="admin-jobs-view">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Job Postings</h1>
          <p className="admin-page-subtitle">Manage open vacancies, requirements, applications, and job SEO</p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => navigate("/admin/jobs/new")}
        >
          <Plus size={16} />
          <span>Post New Job</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={jobs}
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
          { label: "Open", value: "open" },
          { label: "Closed", value: "closed" },
          { label: "Draft", value: "draft" },
        ]}
        emptyMessage="No job postings found. Click 'Post New Job' to create one."
        renderRowActions={(row) => (
          <div className="flex-row-gap text-right" style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="admin-btn-icon"
              title={row.status === "open" ? "Close Job Posting" : "Open Job Posting"}
              onClick={() => handleToggleStatus(row)}
            >
              {row.status === "open" ? (
                <ToggleRight size={18} color="var(--admin-success, #00a32a)" />
              ) : (
                <ToggleLeft size={18} color="#8c8f94" />
              )}
            </button>
            <button
              type="button"
              className="admin-btn-icon"
              title="View Applicants"
              onClick={() => navigate(`/admin/jobs/${row._id}/applications`)}
            >
              <Users size={16} />
            </button>
            <button
              type="button"
              className="admin-btn-icon"
              title="Edit Job"
              onClick={() => navigate(`/admin/jobs/${row._id}`)}
            >
              <Edit size={14} />
            </button>
            <button
              type="button"
              className="admin-btn-icon"
              title="Delete Job"
              onClick={() => {
                setDeletingId(row._id);
                setDeletingTitle(row.title);
              }}
            >
              <Trash2 size={14} color="#d63638" />
            </button>
          </div>
        )}
      />

      {deletingId && (
        <ConfirmDialog
          isOpen={!!deletingId}
          title="Delete Job Posting"
          message={`Are you sure you want to delete "${deletingTitle}"? This action cannot be undone.`}
          confirmLabel="Delete Job"
          isDanger
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}
