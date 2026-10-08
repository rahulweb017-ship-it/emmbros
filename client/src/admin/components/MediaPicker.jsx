import { useState, useEffect, useRef } from "react";
import { Upload, ImageIcon, Search, Check, X } from "lucide-react";
import { apiClient } from "../../api/apiClient";
import { LoadingSpinner } from "./LoadingSpinner";
import { EmptyState } from "./EmptyState";
import { useToast } from "../context/ToastContext";

export function MediaPicker({
  isOpen,
  onClose,
  onSelect,
  title = "Select Media Image",
}) {
  const [activeTab, setActiveTab] = useState("library"); // 'library' | 'upload'
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    if (isOpen && activeTab === "library") {
      fetchMedia();
    }
  }, [isOpen, activeTab, search]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 40, ...(search && { q: search }) });
      const res = await apiClient.get(`/api/admin/media?${params}`);
      setMediaList(res.data || []);
    } catch (err) {
      toast.error("Failed to load media files.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilesUpload = async (files) => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    let validCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds 5MB file size limit.`);
        continue;
      }
      formData.append("files", file);
      validCount++;
    }

    if (validCount === 0) return;

    setUploading(true);
    try {
      const res = await apiClient.post("/api/admin/media/upload", formData);
      toast.success("Image uploaded and converted to WebP!");
      setActiveTab("library");
      const uploaded = Array.isArray(res.data) ? res.data[0] : res.data;
      if (uploaded) setSelectedItem(uploaded);
      fetchMedia();
    } catch (err) {
      toast.error(err.message || "Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  const handleConfirmSelect = () => {
    if (selectedItem) {
      onSelect(selectedItem);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-container"
        style={{ maxWidth: 840, width: "90vw" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <ImageIcon size={20} className="admin-primary-text" />
          <h3 className="admin-modal-title">{title}</h3>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--admin-border)", background: "#fafafa" }}>
          <button
            type="button"
            className={`admin-nav-item ${activeTab === "library" ? "active" : ""}`}
            style={{ borderRadius: 0, padding: "12px 20px" }}
            onClick={() => setActiveTab("library")}
          >
            Media Library
          </button>
          <button
            type="button"
            className={`admin-nav-item ${activeTab === "upload" ? "active" : ""}`}
            style={{ borderRadius: 0, padding: "12px 20px" }}
            onClick={() => setActiveTab("upload")}
          >
            Upload Files
          </button>
        </div>

        <div className="admin-modal-body" style={{ minHeight: 360, maxHeight: "65vh", overflowY: "auto", padding: 20 }}>
          {activeTab === "upload" ? (
            <div
              className={`admin-drag-drop-zone ${dragActive ? "drag-active" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragActive ? "var(--admin-primary)" : "var(--admin-border)"}`,
                borderRadius: 8,
                padding: "40px 20px",
                textAlign: "center",
                background: dragActive ? "#f0f6fc" : "#fafafa",
                cursor: "pointer",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                style={{ display: "none" }}
                onChange={(e) => handleFilesUpload(e.target.files)}
              />
              {uploading ? (
                <LoadingSpinner message="Optimizing & Converting to WebP..." />
              ) : (
                <>
                  <Upload size={44} style={{ color: "var(--admin-text-muted)", marginBottom: 12 }} />
                  <h4 style={{ margin: "0 0 4px 0" }}>Drag & Drop images here or click to browse</h4>
                  <p className="admin-form-hint" style={{ margin: 0 }}>
                    Supports JPG, PNG, WebP, GIF, SVG (Max 5MB per file)
                  </p>
                </>
              )}
            </div>
          ) : (
            <div>
              {/* Search Bar */}
              <div style={{ marginBottom: 16 }}>
                <div className="admin-search-box" style={{ maxWidth: 300 }}>
                  <Search size={16} className="admin-search-icon" />
                  <input
                    type="text"
                    placeholder="Search images..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="admin-search-input"
                  />
                </div>
              </div>

              {loading ? (
                <LoadingSpinner message="Loading images..." />
              ) : mediaList.length === 0 ? (
                <EmptyState
                  icon={ImageIcon}
                  title="No images in library"
                  description="Upload a new file to get started."
                />
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                    gap: 12,
                  }}
                >
                  {mediaList.map((item) => {
                    const isSelected = selectedItem?._id === item._id;
                    return (
                      <div
                        key={item._id}
                        onClick={() => setSelectedItem(item)}
                        style={{
                          position: "relative",
                          border: isSelected ? "3px solid var(--admin-primary)" : "1px solid var(--admin-border)",
                          borderRadius: 6,
                          overflow: "hidden",
                          cursor: "pointer",
                          height: 110,
                          background: "#f0f0f1",
                        }}
                      >
                        <img
                          src={item.url}
                          alt={item.alt || item.filename}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        {isSelected && (
                          <div
                            style={{
                              position: "absolute",
                              top: 6,
                              right: 6,
                              background: "var(--admin-primary)",
                              color: "#fff",
                              borderRadius: "50%",
                              width: 22,
                              height: 22,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Check size={14} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="admin-modal-footer">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            disabled={!selectedItem}
            onClick={handleConfirmSelect}
          >
            Select Image
          </button>
        </div>
      </div>
    </div>
  );
}
