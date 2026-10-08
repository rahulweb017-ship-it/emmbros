import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Plus, Trash2 } from "lucide-react";
import { apiClient } from "../../api/apiClient";
import { DataTable } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../context/ToastContext";

export function PagesPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();
  const toast = useToast();

  const fetchPages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { q: search }),
      });
      const res = await apiClient.get(`/api/admin/pages?${params}`);
      setPages(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch (err) {
      toast.error("Failed to load page list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [page, search]);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await apiClient.delete(`/api/admin/pages/${deletingId}`);
      toast.success("Page deleted successfully.");
      setDeletingId(null);
      fetchPages();
    } catch (err) {
      toast.error("Failed to delete page.");
    }
  };

  const columns = [
    {
      header: "Page Title",
      accessorKey: "title",
      cell: (row) => (
        <div>
          <strong style={{ fontSize: 15 }}>
            <Link to={`/admin/pages/${row._id}`} style={{ color: "var(--admin-primary)", textDecoration: "none" }}>
              {row.title}
            </Link>
          </strong>
          <div className="admin-form-hint">/{row.slug}</div>
        </div>
      ),
    },
    {
      header: "Focus Keyword",
      cell: (row) => row.seo?.focusKeyword ? <span style={{ fontWeight: 600 }}>{row.seo.focusKeyword}</span> : <span className="admin-form-hint">None</span>,
    },
    {
      header: "Meta Title",
      cell: (row) => row.seo?.metaTitle || <span className="admin-form-hint">Default Title</span>,
    },
    {
      header: "Indexing",
      cell: (row) => (row.seo?.noindex ? <span style={{ color: "#d63638", fontWeight: 600 }}>noindex</span> : <span style={{ color: "#008a20", fontWeight: 600 }}>index</span>),
    },
  ];

  return (
    <div className="admin-pages-view">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pages & On-Page SEO Management</h1>
          <p className="admin-page-subtitle">Configure Yoast-style SEO meta tags and content for website pages</p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => navigate("/admin/pages/new")}
        >
          <Plus size={16} />
          <span>Add New Page</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={pages}
        loading={loading}
        total={total}
        page={page}
        limit={10}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={setSearch}
        emptyMessage="No customized pages found. Click 'Add New Page' to configure SEO."
        renderRowActions={(row) => (
          <div className="flex-row-gap text-right" style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="admin-btn-icon"
              title="Edit Page SEO"
              onClick={() => navigate(`/admin/pages/${row._id}`)}
            >
              <Edit size={14} />
            </button>
            <button
              type="button"
              className="admin-btn-icon"
              title="Delete Page"
              onClick={() => setDeletingId(row._id)}
            >
              <Trash2 size={14} color="#d63638" />
            </button>
          </div>
        )}
      />

      {deletingId && (
        <ConfirmDialog
          isOpen={!!deletingId}
          title="Delete Page SEO Settings"
          message="Are you sure you want to delete this page configuration?"
          confirmLabel="Delete Page"
          isDanger
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}
