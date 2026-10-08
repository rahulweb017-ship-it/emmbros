import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { apiClient } from "../../api/apiClient";
import { FormField } from "../components/FormField";
import { RichTextEditor } from "../components/RichTextEditor";
import { SeoPanel } from "../components/SeoPanel";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";

export function PageEditPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
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

  useEffect(() => {
    if (!isEditing) return;

    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/admin/pages/${id}`);
        const page = res.data;
        if (page) {
          setTitle(page.title || "");
          setSlug(page.slug || "");
          setContent(typeof page.content === "string" ? page.content : JSON.stringify(page.content || ""));
          setSeo(
            page.seo || {
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
        }
      } catch (err) {
        toast.error("Failed to load page SEO settings.");
        navigate("/admin/pages");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [id, isEditing]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Page title is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        content,
        seo,
      };

      if (isEditing) {
        await apiClient.put(`/api/admin/pages/${id}`, payload);
        toast.success("Page SEO updated successfully!");
      } else {
        const res = await apiClient.post("/api/admin/pages", payload);
        toast.success("Page created successfully!");
        navigate(`/admin/pages/${res.data._id}`, { replace: true });
      }

      setIsDirty(false);
    } catch (err) {
      toast.error(err.message || "Failed to save page SEO.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading page SEO settings..." size="large" />;
  }

  return (
    <div className="admin-page-edit-view">
      {/* Header Bar */}
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            className="admin-btn-icon"
            onClick={() => navigate("/admin/pages")}
            title="Back to Pages"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="admin-page-title">
              {isEditing ? `Edit SEO: ${title || "Page"}` : "Add New Page"}
            </h1>
            <p className="admin-page-subtitle">Configure search engine metadata, OpenGraph tags, and SEO analysis</p>
          </div>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={16} />
          <span>{saving ? "Saving..." : isEditing ? "Save SEO Settings" : "Create Page"}</span>
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Title & Slug */}
        <div className="admin-card" style={{ background: "#fff", padding: 20, borderRadius: 8, border: "1px solid #dcdcde" }}>
          <FormField label="Page Title" required>
            <input
              type="text"
              className="admin-input"
              style={{ fontSize: 18, fontWeight: 600 }}
              placeholder="e.g. Who We Are / Automotive Forging Capability"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsDirty(true);
              }}
            />
          </FormField>

          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#50575e", display: "block", marginBottom: 4 }}>
              PERMALINK SLUG
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, color: "#646970" }}>/</span>
              <input
                type="text"
                className="admin-input"
                style={{ flex: 1, fontSize: 13 }}
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsDirty(true);
                }}
              />
            </div>
          </div>
        </div>

        {/* Page Content / Body (for SEO content checks) */}
        <div className="admin-card" style={{ background: "#fff", padding: 20, borderRadius: 8, border: "1px solid #dcdcde" }}>
          <FormField label="Page Body Content" hint="Used for word count and keyword density analysis">
            <RichTextEditor
              content={content}
              onChange={(html) => {
                setContent(html);
                setIsDirty(true);
              }}
            />
          </FormField>
        </div>

        {/* Yoast-Style SEO Panel */}
        <SeoPanel
          seo={seo}
          onChange={(updatedSeo) => {
            setSeo(updatedSeo);
            setIsDirty(true);
          }}
          title={title}
          slug={slug}
          content={content}
          section=""
          type="page"
        />
      </div>
    </div>
  );
}
