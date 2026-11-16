import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Plus, Trash2, RefreshCw, ExternalLink, Globe, CheckCircle2, AlertCircle } from "lucide-react";
import { apiClient } from "../../api/apiClient";
import { DataTable } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../context/ToastContext";

export function PagesPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();
  const toast = useToast();

  const fetchPages = async (isInitial = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 25,
        ...(search && { q: search }),
      });
      const res = await apiClient.get(`/api/admin/pages?${params}`);
      const dataList = res.data || [];
      const totalCount = res.pagination?.total || 0;

      // Auto-seed if database has 0 pages and this is an initial fetch without search
      if (isInitial && totalCount === 0 && !search) {
        console.log("Pages list empty on initial load, triggering auto-sync...");
        const syncRes = await apiClient.post("/api/admin/pages/sync");
        if (syncRes.ok && syncRes.total > 0) {
          const refreshed = await apiClient.get(`/api/admin/pages?page=1&limit=25`);
          setPages(refreshed.data || []);
          setTotal(refreshed.pagination?.total || 0);
          setLoading(false);
          return;
        }
      }

      setPages(dataList);
      setTotal(totalCount);
    } catch (err) {
      toast.error("Failed to load page list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages(true);
  }, [page, search]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await apiClient.post("/api/admin/pages/sync");
      toast.success(res.message || "All website pages synchronized successfully!");
      fetchPages();
    } catch (err) {
      toast.error(err.message || "Failed to synchronize pages.");
    } finally {
      setSyncing(false);
    }
  };

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

  const getPageUrl = (slug) => {
    if (slug === "home" || slug === "root" || slug === "") return "/";
    if (slug.includes("/")) return `/${slug.replace(/^\/+/, "")}`;
    const productSlugs = [
      "rear-axle-shaft",
      "front-axle-shaft",
      "gear-box-parts",
      "driveline-parts",
      "hydraulic-parts",
      "planetary-wheel-drive-parts",
    ];
    if (productSlugs.includes(slug)) {
      return `/product-application/${slug}`;
    }
    return `/${slug}`;
  };

  const columns = [
    {
      header: "Page & Live Route",
      accessorKey: "title",
      cell: (row) => {
        const livePath = getPageUrl(row.slug);
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Link
                to={`/admin/pages/${row._id}`}
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--admin-primary)",
                  textDecoration: "none",
                }}
              >
                {row.title}
              </Link>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
              <Globe size={12} style={{ opacity: 0.7 }} />
              <code style={{ fontSize: 12, color: "#475569", background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>
                {livePath}
              </code>
              <a
                href={livePath}
                target="_blank"
                rel="noreferrer"
                title="View live page in new tab"
                style={{ display: "inline-flex", alignItems: "center", color: "#94a3b8" }}
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        );
      },
    },
    {
      header: "Focus Keyword",
      cell: (row) =>
        row.seo?.focusKeyword ? (
          <span
            style={{
              display: "inline-block",
              background: "#eff6ff",
              color: "#1d4ed8",
              border: "1px solid #dbeafe",
              padding: "2px 8px",
              borderRadius: "6px",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {row.seo.focusKeyword}
          </span>
        ) : (
          <span style={{ color: "#94a3b8", fontSize: 13, fontStyle: "italic" }}>None set</span>
        ),
    },
    {
      header: "Meta Title & Description",
      cell: (row) => (
        <div style={{ maxWidth: 380 }}>
          <div
            style={{
              fontWeight: 500,
              fontSize: 13,
              color: "#1e293b",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={row.seo?.metaTitle || row.title}
          >
            {row.seo?.metaTitle || row.title}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#64748b",
              marginTop: 2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={row.seo?.metaDescription || "No description configured."}
          >
            {row.seo?.metaDescription || <span style={{ fontStyle: "italic" }}>No description configured.</span>}
          </div>
        </div>
      ),
    },
    {
      header: "Search Index",
      cell: (row) =>
        row.seo?.noindex ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              color: "#dc2626",
              background: "#fef2f2",
              border: "1px solid #fee2e2",
              padding: "2px 8px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <AlertCircle size={12} />
            noindex
          </span>
        ) : (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              color: "#059669",
              background: "#ecfdf5",
              border: "1px solid #d1fae5",
              padding: "2px 8px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={12} />
            index
          </span>
        ),
    },
  ];

  return (
    <div className="admin-pages-view">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pages & On-Page SEO Management</h1>
          <p className="admin-page-subtitle">Configure Yoast-style SEO meta tags, social cards, and schema for website pages</p>
        </div>
        <div className="flex-row-gap" style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={handleSync}
            disabled={syncing}
            title="Import and synchronize default site pages from config"
          >
            <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
            <span>{syncing ? "Syncing..." : "Sync All Pages"}</span>
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => navigate("/admin/pages/new")}
          >
            <Plus size={16} />
            <span>Add New Page</span>
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={pages}
        loading={loading}
        total={total}
        page={page}
        limit={25}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={setSearch}
        emptyMessage="No pages found. Click 'Sync All Pages' to automatically load the site pages."
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
              <Trash2 size={14} color="#dc2626" />
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
