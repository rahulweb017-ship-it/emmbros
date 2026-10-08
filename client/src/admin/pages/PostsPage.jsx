import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { apiClient } from "../../api/apiClient";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../context/ToastContext";

export function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { q: search }),
        ...(statusFilter && { status: statusFilter }),
      });
      const res = await apiClient.get(`/api/admin/posts?${params}`);
      setPosts(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch (err) {
      toast.error("Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, search, statusFilter]);

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/admin/posts/${deleteItem._id}`);
      toast.success(`Post "${deleteItem.title}" deleted.`);
      setDeleteItem(null);
      fetchPosts();
    } catch (err) {
      toast.error(err.message || "Failed to delete post.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: "Title",
      accessorKey: "title",
      cell: (row) => (
        <div>
          <strong style={{ fontSize: 15 }}>{row.title}</strong>
          <div className="admin-form-hint">/{row.slug}</div>
        </div>
      ),
    },
    { header: "Category", accessorKey: "category" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Author",
      cell: (row) => row.author?.name || row.author?.email || "Admin",
    },
    {
      header: "Date",
      cell: (row) => (
        <span className="admin-form-hint">
          {new Date(row.publishedAt || row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="admin-posts-view">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Blog Posts</h1>
          <p className="admin-page-subtitle">Manage news, articles, and scheduled posts</p>
        </div>
        <Link to="/admin/posts/new" className="admin-btn admin-btn-primary">
          <Plus size={16} />
          <span>Add New Post</span>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={posts}
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
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" },
          { label: "Scheduled", value: "scheduled" },
        ]}
        emptyMessage="No blog posts found. Click 'Add New Post' to create one."
        renderRowActions={(row) => (
          <div className="flex-row-gap text-right">
            {row.status === "published" && (
              <a
                href={`/api/posts/${row.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn-icon"
                title="View Post Payload"
              >
                <ExternalLink size={14} />
              </a>
            )}
            <button
              type="button"
              className="admin-btn-icon"
              title="Edit Post"
              onClick={() => navigate(`/admin/posts/${row._id}`)}
            >
              <Edit size={14} />
            </button>
            <button
              type="button"
              className="admin-btn-icon"
              title="Delete Post"
              onClick={() => setDeleteItem(row)}
            >
              <Trash2 size={14} color="#d63638" />
            </button>
          </div>
        )}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteItem}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteItem?.title}"? This action cannot be undone.`}
        confirmText="Delete Post"
        loading={deleting}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
