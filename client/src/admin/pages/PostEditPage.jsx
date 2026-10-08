import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Calendar, Image as ImageIcon, Sparkles, CheckCircle2 } from "lucide-react";
import { apiClient } from "../../api/apiClient";
import { FormField } from "../components/FormField";
import { RichTextEditor } from "../components/RichTextEditor";
import { MediaPicker } from "../components/MediaPicker";
import { SeoPanel } from "../components/SeoPanel";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";

export function PostEditPage() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState("draft");
  const [publishedAt, setPublishedAt] = useState("");
  const [featuredImage, setFeaturedImage] = useState({ url: "", alt: "" });
  const [seo, setSeo] = useState({
    metaTitle: "",
    metaDescription: "",
    focusKeyword: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    noindex: false,
    nofollow: false,
  });

  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // Auto slug generation from title if not manually touched
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!slugTouched && title) {
      const generated = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");
      setSlug(generated);
    }
  }, [title, slugTouched]);

  // Fetch existing post details if edit mode
  useEffect(() => {
    if (!isEditMode) return;

    async function fetchPost() {
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/admin/posts/${id}`);
        const post = res.data;
        if (post) {
          setTitle(post.title || "");
          setSlug(post.slug || "");
          setExcerpt(post.excerpt || "");
          setContent(post.content || "");
          setCategory(post.category || "General");
          setTagsInput((post.tags || []).join(", "));
          setStatus(post.status || "draft");
          setPublishedAt(post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : "");
          setFeaturedImage(post.featuredImage || { url: "", alt: "" });
          setSeo(
            post.seo || {
              metaTitle: "",
              metaDescription: "",
              focusKeyword: "",
              canonicalUrl: "",
              ogTitle: "",
              ogDescription: "",
              ogImage: "",
              noindex: false,
              nofollow: false,
            }
          );
          setLastSavedTime(new Date(post.updatedAt).toLocaleTimeString());
        }
      } catch (err) {
        toast.error("Failed to load blog post details.");
        navigate("/admin/posts");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id, isEditMode]);

  // Warn user of unsaved changes before leaving page
  useEffect(() => {
    function handleBeforeUnload(e) {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Autosave draft timer (every 30 seconds)
  useEffect(() => {
    if (!isDirty || saving || autoSaving) return;

    const timer = setTimeout(async () => {
      if (title.trim()) {
        setAutoSaving(true);
        try {
          const payload = getPayload();
          payload.status = "draft"; // autosave as draft
          if (isEditMode) {
            await apiClient.put(`/api/admin/posts/${id}`, payload);
          } else {
            const res = await apiClient.post("/api/admin/posts", payload);
            if (res.data?._id) {
              navigate(`/admin/posts/${res.data._id}`, { replace: true });
            }
          }
          setIsDirty(false);
          setLastSavedTime(new Date().toLocaleTimeString());
        } catch (err) {
          // Silent failure for background autosave
        } finally {
          setAutoSaving(false);
        }
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isDirty, title, content, status, saving, autoSaving]);

  const getPayload = () => {
    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    return {
      title,
      slug,
      excerpt,
      content,
      category,
      tags: tagsArray,
      status,
      publishedAt: status === "scheduled" && publishedAt ? new Date(publishedAt).toISOString() : undefined,
      featuredImage,
      seo,
    };
  };

  const handleSave = async (targetStatus = status) => {
    setErrors({});
    if (!title.trim()) {
      setErrors({ title: "Title is required" });
      toast.error("Please enter a title for the post.");
      return;
    }
    if (!content.trim()) {
      setErrors({ content: "Post content is required" });
      toast.error("Post content cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const payload = getPayload();
      payload.status = targetStatus;

      let res;
      if (isEditMode) {
        res = await apiClient.put(`/api/admin/posts/${id}`, payload);
        toast.success("Post updated successfully!");
      } else {
        res = await apiClient.post("/api/admin/posts", payload);
        toast.success("Post created successfully!");
        navigate(`/admin/posts/${res.data._id}`, { replace: true });
      }

      setIsDirty(false);
      setStatus(targetStatus);
      setLastSavedTime(new Date().toLocaleTimeString());
    } catch (err) {
      toast.error(err.message || "Failed to save post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading post editor..." size="large" />;
  }

  return (
    <div className="admin-post-edit-view">
      {/* Header Bar */}
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/admin/posts" className="admin-btn-icon" title="Back to Posts">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="admin-page-title">{isEditMode ? "Edit Post" : "Add New Post"}</h1>
            <p className="admin-page-subtitle">
              {lastSavedTime ? (
                <span style={{ color: "#008a20", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <CheckCircle2 size={13} /> Saved at {lastSavedTime}
                </span>
              ) : (
                "Compose blog post content and media"
              )}
              {autoSaving && " (Autosaving draft...)"}
            </p>
          </div>
        </div>

        <div className="flex-row-gap">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            disabled={saving}
            onClick={() => handleSave("draft")}
          >
            <Save size={16} />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            className="admin-btn admin-btn-primary"
            disabled={saving}
            onClick={() => handleSave("published")}
          >
            <Sparkles size={16} />
            <span>{status === "published" ? "Update Post" : "Publish Now"}</span>
          </button>
        </div>
      </div>

      {/* WordPress-style Two-Column Form Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
        {/* Left Column: Title, Slug, Rich Text Content, Excerpt, SEO Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Post Title */}
          <div className="admin-card" style={{ padding: 20 }}>
            <FormField label="Post Title" required error={errors.title}>
              <input
                type="text"
                placeholder="Enter post title here..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setIsDirty(true);
                }}
                className="admin-input"
                style={{ fontSize: 18, fontWeight: 700 }}
              />
            </FormField>

            <FormField label="Permalink Slug" hint="Editable unique URL identifier">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="admin-form-hint">/posts/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugTouched(true);
                    setIsDirty(true);
                  }}
                  className="admin-input"
                  style={{ fontSize: 13 }}
                />
              </div>
            </FormField>
          </div>

          {/* Rich Text Content Editor */}
          <div className="admin-card" style={{ padding: 20 }}>
            <FormField label="Post Content" required error={errors.content}>
              <RichTextEditor
                content={content}
                onChange={(html) => {
                  setContent(html);
                  setIsDirty(true);
                }}
              />
            </FormField>
          </div>

          {/* Excerpt */}
          <div className="admin-card" style={{ padding: 20 }}>
            <FormField label="Excerpt / Summary" hint="Short summary shown in blog list cards and search snippets">
              <textarea
                rows={3}
                placeholder="Enter post summary..."
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value);
                  setIsDirty(true);
                }}
                className="admin-textarea"
              />
            </FormField>
          </div>

          {/* YOAST-STYLE ON-PAGE SEO PANEL */}
          <SeoPanel
            seo={seo}
            onChange={(updatedSeo) => {
              setSeo(updatedSeo);
              setIsDirty(true);
            }}
            title={title}
            slug={slug}
            content={content}
            excerpt={excerpt}
            section="posts"
            type="post"
          />
        </div>

        {/* Right Column: Publish Box, Category, Tags, Featured Image */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Publish Box */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Publish Options</h3>
            </div>

            <FormField label="Status">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setIsDirty(true);
                }}
                className="admin-select-input"
                style={{ width: "100%" }}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </FormField>

            {status === "scheduled" && (
              <FormField label="Schedule Publish Date & Time" required>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Calendar size={16} className="admin-search-icon" style={{ position: "static" }} />
                  <input
                    type="datetime-local"
                    value={publishedAt}
                    onChange={(e) => {
                      setPublishedAt(e.target.value);
                      setIsDirty(true);
                    }}
                    className="admin-input"
                  />
                </div>
              </FormField>
            )}

            <div style={{ borderTop: "1px solid #f0f0f1", paddingTop: 12, marginTop: 12, display: "flex", gap: 8 }}>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => handleSave()}
                disabled={saving}
              >
                {saving ? "Saving..." : isEditMode ? "Update" : "Save"}
              </button>
            </div>
          </div>

          {/* Featured Image Box */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Featured Image</h3>
            </div>

            {featuredImage.url ? (
              <div>
                <img
                  src={featuredImage.url}
                  alt={featuredImage.alt || "Featured image"}
                  style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 6, marginBottom: 10 }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    style={{ flex: 1, fontSize: 12, padding: "4px 8px" }}
                    onClick={() => setMediaPickerOpen(true)}
                  >
                    Replace Image
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger"
                    style={{ padding: "4px 8px", fontSize: 12 }}
                    onClick={() => setFeaturedImage({ url: "", alt: "" })}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                style={{ width: "100%", justifyContent: "center", padding: 24, borderStyle: "dashed" }}
                onClick={() => setMediaPickerOpen(true)}
              >
                <ImageIcon size={20} />
                <span>Select Featured Image</span>
              </button>
            )}
          </div>

          {/* Categories & Tags Box */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Category & Tags</h3>
            </div>

            <FormField label="Category">
              <input
                type="text"
                placeholder="e.g. Technology, Manufacturing"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setIsDirty(true);
                }}
                className="admin-input"
              />
            </FormField>

            <FormField label="Tags" hint="Separate tags with commas (e.g. Forging, OEM, HP)">
              <input
                type="text"
                placeholder="Forging, OEM, Automotive"
                value={tagsInput}
                onChange={(e) => {
                  setTagsInput(e.target.value);
                  setIsDirty(true);
                }}
                className="admin-input"
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Featured Image MediaPicker Modal */}
      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(media) => {
          setFeaturedImage({ url: media.url, alt: media.alt || "" });
          setIsDirty(true);
        }}
        title="Select Featured Image"
      />
    </div>
  );
}
