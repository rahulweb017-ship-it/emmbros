import { useEffect, useState } from "react";
import { Upload, Image as ImageIcon, Trash2, Copy, Check, Edit2, Search } from "lucide-react";
import { apiClient } from "../../api/apiClient";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { EmptyState } from "../components/EmptyState";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { MediaPicker } from "../components/MediaPicker";
import { useToast } from "../context/ToastContext";

export function MediaPage() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [editingAltId, setEditingAltId] = useState(null);
  const [editingAltText, setEditingAltText] = useState("");
  const toast = useToast();

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 40, ...(search && { q: search }) });
      const res = await apiClient.get(`/api/admin/media?${params}`);
      setMediaItems(res.data || []);
    } catch (err) {
      toast.error("Failed to load media files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [search]);

  const handleCopyUrl = (url, id) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    toast.success("Image URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveAlt = async (id) => {
    try {
      await apiClient.put(`/api/admin/media/${id}/alt`, { alt: editingAltText });
      toast.success("Alt text updated successfully.");
      setEditingAltId(null);
      fetchMedia();
    } catch (err) {
      toast.error("Failed to update alt text.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    try {
      await apiClient.delete(`/api/admin/media/${deleteItem._id}`);
      toast.success("Media file deleted.");
      setDeleteItem(null);
      fetchMedia();
    } catch (err) {
      toast.error("Failed to delete media file.");
    }
  };

  return (
    <div className="admin-media-view">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Media Library</h1>
          <p className="admin-page-subtitle">Upload and manage images, WebP assets, and media files</p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => setPickerOpen(true)}
        >
          <Upload size={16} />
          <span>Upload Media</span>
        </button>
      </div>

      {/* Toolbar Search */}
      <div className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-search-box" style={{ maxWidth: 320 }}>
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search files by name or alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="admin-card">
        {loading ? (
          <LoadingSpinner message="Loading media assets..." />
        ) : mediaItems.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            title="No Media Assets Found"
            description="Upload image files to use in blog posts and job listings."
            actionButton={
              <button type="button" className="admin-btn admin-btn-primary" onClick={() => setPickerOpen(true)}>
                Upload File Now
              </button>
            }
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 20,
            }}
          >
            {mediaItems.map((item) => (
              <div
                key={item._id}
                className="admin-card"
                style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8, background: "#fafafa" }}
              >
                <div style={{ height: 130, borderRadius: 6, overflow: "hidden", background: "#e2e8f0" }}>
                  <img
                    src={item.url}
                    alt={item.alt || item.filename}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      fontSize: 13,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={item.filename}
                  >
                    {item.filename}
                  </p>
                  <p className="admin-form-hint" style={{ margin: "2px 0 0 0", fontSize: 11 }}>
                    {(item.size / 1024).toFixed(1)} KB • {item.mimeType}
                  </p>

                  {/* Alt Text Display & Edit */}
                  <div style={{ marginTop: 8 }}>
                    {editingAltId === item._id ? (
                      <div style={{ display: "flex", gap: 4 }}>
                        <input
                          type="text"
                          value={editingAltText}
                          onChange={(e) => setEditingAltText(e.target.value)}
                          className="admin-input"
                          style={{ padding: "2px 6px", fontSize: 12 }}
                          placeholder="Alt text"
                        />
                        <button
                          type="button"
                          className="admin-btn admin-btn-primary"
                          style={{ padding: "2px 8px", fontSize: 12 }}
                          onClick={() => handleSaveAlt(item._id)}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span className="admin-form-hint" style={{ fontSize: 11, fontStyle: item.alt ? "normal" : "italic" }}>
                          Alt: {item.alt || "No alt text"}
                        </span>
                        <button
                          type="button"
                          className="admin-btn-icon"
                          style={{ padding: 2 }}
                          title="Edit Alt Text"
                          onClick={() => {
                            setEditingAltId(item._id);
                            setEditingAltText(item.alt || "");
                          }}
                        >
                          <Edit2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* File Action Controls */}
                <div style={{ display: "flex", gap: 6, borderTop: "1px solid #e2e8f0", paddingTop: 8 }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    style={{ flex: 1, padding: "4px 8px", fontSize: 12, justifyContent: "center" }}
                    onClick={() => handleCopyUrl(item.url, item._id)}
                  >
                    {copiedId === item._id ? <Check size={12} color="#008a20" /> : <Copy size={12} />}
                    <span>{copiedId === item._id ? "Copied" : "Copy URL"}</span>
                  </button>

                  <button
                    type="button"
                    className="admin-btn-icon"
                    title="Delete File"
                    onClick={() => setDeleteItem(item)}
                  >
                    <Trash2 size={14} color="#d63638" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Media Picker Upload Modal */}
      <MediaPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={() => {
          fetchMedia();
          setPickerOpen(false);
        }}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteItem}
        title="Delete Media File"
        message={`Are you sure you want to delete "${deleteItem?.filename}"? Any posts or pages referencing this URL will show a broken image.`}
        confirmText="Delete File"
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
