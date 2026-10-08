import { useState, useMemo } from "react";
import {
  Search,
  Share2,
  Settings,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Smartphone,
  Monitor,
  Image as ImageIcon,
} from "lucide-react";
import { FormField } from "./FormField";
import { MediaPicker } from "./MediaPicker";
import { analyzeSeo, resolveTemplateVariables, extractTextFromHtml } from "../utils/seoAnalyzer";

export function SeoPanel({
  seo = {},
  onChange,
  title = "",
  slug = "",
  content = "",
  excerpt = "",
  section = "blog",
  type = "post",
}) {
  const [activeTab, setActiveTab] = useState("general");
  const [devicePreview, setDevicePreview] = useState("desktop");
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // Helper to update a field in the `seo` object
  const updateSeoField = (key, value) => {
    onChange({
      ...seo,
      [key]: value,
    });
  };

  // Resolved values for previews
  const resolvedTitle = resolveTemplateVariables(seo.metaTitle || title || "Untitled Title", {
    title: title || "Untitled Title",
    sitename: "Emmbros",
  });

  const plainContentText = extractTextFromHtml(content);
  const resolvedDescription =
    seo.metaDescription || excerpt || plainContentText.slice(0, 155) || "Please provide a meta description or content excerpt for search engine previews.";

  const displaySlug = slug || "sample-url-slug";
  const displayUrl = `https://emmbros.com/${section}/${displaySlug}`;

  // Analyze SEO on the fly
  const analysis = useMemo(() => {
    return analyzeSeo({
      title,
      slug,
      content,
      excerpt,
      seo,
      type,
    });
  }, [title, slug, content, excerpt, seo, type]);

  // Character bar color calculation
  const getTitleBarColor = (length) => {
    if (length >= 50 && length <= 60) return "var(--admin-success, #00a32a)";
    if ((length >= 35 && length < 50) || (length > 60 && length <= 70)) return "#dba617";
    return "#d63638";
  };

  const getDescBarColor = (length) => {
    if (length >= 120 && length <= 155) return "var(--admin-success, #00a32a)";
    if ((length >= 80 && length < 120) || (length > 155 && length <= 170)) return "#dba617";
    return "#d63638";
  };

  return (
    <div
      className="admin-seo-panel"
      style={{
        background: "#fff",
        borderRadius: 8,
        border: "1px solid #dcdcde",
        overflow: "hidden",
        marginTop: 20,
      }}
    >
      {/* Panel Header & Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid #dcdcde",
          background: "#f6f7f7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: "#1d2327" }}>
            Yoast SEO Settings
          </h3>
          {/* Overall Health Badge */}
          <span
            style={{
              padding: "3px 10px",
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              backgroundColor:
                analysis.overallRating === "good"
                  ? "#edfaef"
                  : analysis.overallRating === "needs-improvement"
                  ? "#fff8e5"
                  : "#fcf0f1",
              color:
                analysis.overallRating === "good"
                  ? "#00a32a"
                  : analysis.overallRating === "needs-improvement"
                  ? "#996800"
                  : "#d63638",
              border: `1px solid ${
                analysis.overallRating === "good"
                  ? "#4ab866"
                  : analysis.overallRating === "needs-improvement"
                  ? "#cca200"
                  : "#e68a8c"
              }`,
            }}
          >
            {analysis.overallRating === "good" && <CheckCircle size={13} />}
            {analysis.overallRating === "needs-improvement" && <AlertTriangle size={13} />}
            {analysis.overallRating === "poor" && <XCircle size={13} />}
            {analysis.overallRating === "good"
              ? "Good SEO"
              : analysis.overallRating === "needs-improvement"
              ? "Needs Improvement"
              : "Poor SEO"}
          </span>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            className={`admin-btn ${activeTab === "general" ? "admin-btn-primary" : "admin-btn-secondary"}`}
            style={{ padding: "5px 12px", fontSize: 13 }}
            onClick={() => setActiveTab("general")}
          >
            <Search size={14} /> General SEO
          </button>
          <button
            type="button"
            className={`admin-btn ${activeTab === "social" ? "admin-btn-primary" : "admin-btn-secondary"}`}
            style={{ padding: "5px 12px", fontSize: 13 }}
            onClick={() => setActiveTab("social")}
          >
            <Share2 size={14} /> Social (OG)
          </button>
          <button
            type="button"
            className={`admin-btn ${activeTab === "analysis" ? "admin-btn-primary" : "admin-btn-secondary"}`}
            style={{ padding: "5px 12px", fontSize: 13 }}
            onClick={() => setActiveTab("analysis")}
          >
            <CheckCircle size={14} /> Analysis ({analysis.goodCount}/{analysis.totalChecks})
          </button>
          <button
            type="button"
            className={`admin-btn ${activeTab === "advanced" ? "admin-btn-primary" : "admin-btn-secondary"}`}
            style={{ padding: "5px 12px", fontSize: 13 }}
            onClick={() => setActiveTab("advanced")}
          >
            <Settings size={14} /> Advanced
          </button>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* ================= TAB 1: GENERAL SEO ================= */}
        {activeTab === "general" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Google Snippet Live Preview Box */}
            <div
              style={{
                border: "1px solid #dcdcde",
                borderRadius: 8,
                padding: 16,
                background: "#fafafa",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <h4 style={{ fontSize: 13, fontWeight: 600, margin: 0, textTransform: "uppercase", color: "#646970" }}>
                  Google Search Snippet Preview
                </h4>
                <div style={{ display: "flex", gap: 4, background: "#e0e0e0", padding: 2, borderRadius: 4 }}>
                  <button
                    type="button"
                    style={{
                      border: "none",
                      background: devicePreview === "desktop" ? "#fff" : "transparent",
                      padding: "3px 8px",
                      borderRadius: 3,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                    }}
                    onClick={() => setDevicePreview("desktop")}
                  >
                    <Monitor size={13} /> Desktop
                  </button>
                  <button
                    type="button"
                    style={{
                      border: "none",
                      background: devicePreview === "mobile" ? "#fff" : "transparent",
                      padding: "3px 8px",
                      borderRadius: 3,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                    }}
                    onClick={() => setDevicePreview("mobile")}
                  >
                    <Smartphone size={13} /> Mobile
                  </button>
                </div>
              </div>

              {/* Rendered Snippet Card */}
              <div
                style={{
                  background: "#fff",
                  padding: 16,
                  borderRadius: 6,
                  border: "1px solid #e0e0e0",
                  maxWidth: devicePreview === "mobile" ? 360 : 600,
                  fontFamily: "arial, sans-serif",
                }}
              >
                <div style={{ fontSize: 12, color: "#202124", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: 600 }}>Emmbros</span>
                  <span style={{ color: "#5f6368" }}>{displayUrl}</span>
                </div>
                <div
                  style={{
                    fontSize: 18,
                    color: "#1a0dab",
                    lineHeight: "1.3",
                    textDecoration: "none",
                    fontWeight: 400,
                    marginBottom: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {resolvedTitle}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#4d5156",
                    lineHeight: "1.4",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {resolvedDescription}
                </div>
              </div>
            </div>

            {/* Input Fields */}
            <FormField label="Focus Keyword" hint="Main keyword or phrase you want this page to rank for">
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. automotive forging baddi / cnc machining"
                value={seo.focusKeyword || ""}
                onChange={(e) => updateSeoField("focusKeyword", e.target.value)}
              />
            </FormField>

            {/* Meta Title with Live Character Counter & Color Bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>SEO Meta Title</label>
                <span style={{ fontSize: 12, color: "#646970" }}>
                  {(seo.metaTitle || "").length} / 60 characters
                </span>
              </div>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. %title% | %sitename%"
                value={seo.metaTitle || ""}
                onChange={(e) => updateSeoField("metaTitle", e.target.value)}
              />
              {/* Color Bar */}
              <div
                style={{
                  height: 4,
                  width: "100%",
                  background: "#e0e0e0",
                  borderRadius: 2,
                  marginTop: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, (((seo.metaTitle || "").length / 60) * 100))}%`,
                    background: getTitleBarColor((seo.metaTitle || "").length),
                    transition: "all 0.2s ease",
                  }}
                />
              </div>
              <div style={{ marginTop: 4, fontSize: 12, color: "#646970" }}>
                Shortcuts: <code style={{ background: "#eee", padding: "1px 4px", borderRadius: 3 }}>%title%</code>{" "}
                <code style={{ background: "#eee", padding: "1px 4px", borderRadius: 3 }}>%sitename%</code>
              </div>
            </div>

            {/* Meta Description with Live Character Counter & Color Bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>Meta Description</label>
                <span style={{ fontSize: 12, color: "#646970" }}>
                  {(seo.metaDescription || "").length} / 155 characters
                </span>
              </div>
              <textarea
                className="admin-textarea"
                rows={3}
                placeholder="Provide a concise summary that encourages users in search results to click..."
                value={seo.metaDescription || ""}
                onChange={(e) => updateSeoField("metaDescription", e.target.value)}
              />
              {/* Color Bar */}
              <div
                style={{
                  height: 4,
                  width: "100%",
                  background: "#e0e0e0",
                  borderRadius: 2,
                  marginTop: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, (((seo.metaDescription || "").length / 155) * 100))}%`,
                    background: getDescBarColor((seo.metaDescription || "").length),
                    transition: "all 0.2s ease",
                  }}
                />
              </div>
            </div>

            <FormField label="Canonical URL" hint="Leave blank to default to standard page permalink">
              <input
                type="text"
                className="admin-input"
                placeholder="https://emmbros.com/custom-canonical-url"
                value={seo.canonicalUrl || ""}
                onChange={(e) => updateSeoField("canonicalUrl", e.target.value)}
              />
            </FormField>
          </div>
        )}

        {/* ================= TAB 2: SOCIAL (OPEN GRAPH) ================= */}
        {activeTab === "social" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Open Graph Card Live Preview */}
            <div
              style={{
                border: "1px solid #dcdcde",
                borderRadius: 8,
                padding: 16,
                background: "#fafafa",
              }}
            >
              <h4 style={{ fontSize: 13, fontWeight: 600, margin: "0 0 12px 0", textTransform: "uppercase", color: "#646970" }}>
                Facebook & LinkedIn Card Preview
              </h4>

              <div
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  overflow: "hidden",
                  maxWidth: 500,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    height: 200,
                    background: "#f0f0f1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {seo.ogImage ? (
                    <img
                      src={seo.ogImage}
                      alt="OG Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ textAlign: "center", color: "#8c8f94" }}>
                      <ImageIcon size={32} />
                      <div style={{ fontSize: 12, marginTop: 4 }}>No Social Image Selected</div>
                    </div>
                  )}
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 11, color: "#65676b", textTransform: "uppercase", fontWeight: 600 }}>
                    EMMBROS.COM
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#050505",
                      marginTop: 4,
                      marginBottom: 4,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {seo.ogTitle || resolvedTitle}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#65676b",
                      lineHeight: "1.3",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {seo.ogDescription || resolvedDescription}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Fields */}
            <FormField label="Facebook / Open Graph Title">
              <input
                type="text"
                className="admin-input"
                placeholder="Leave blank to use default Meta Title"
                value={seo.ogTitle || ""}
                onChange={(e) => updateSeoField("ogTitle", e.target.value)}
              />
            </FormField>

            <FormField label="Facebook / Open Graph Description">
              <textarea
                className="admin-textarea"
                rows={3}
                placeholder="Leave blank to use default Meta Description"
                value={seo.ogDescription || ""}
                onChange={(e) => updateSeoField("ogDescription", e.target.value)}
              />
            </FormField>

            {/* OG Image Selector */}
            <FormField label="Social Sharing Image (OG Image)" hint="Recommended image size: 1200 x 630 px">
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {seo.ogImage && (
                  <img
                    src={seo.ogImage}
                    alt="OG Thumbnail"
                    style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4, border: "1px solid #ccc" }}
                  />
                )}
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowMediaPicker(true)}
                >
                  <ImageIcon size={14} /> Select Social Image
                </button>
                {seo.ogImage && (
                  <button
                    type="button"
                    className="admin-btn-icon"
                    onClick={() => updateSeoField("ogImage", "")}
                    title="Remove Image"
                  >
                    <XCircle size={16} color="#d63638" />
                  </button>
                )}
              </div>
            </FormField>
          </div>
        )}

        {/* ================= TAB 3: ANALYSIS CHECKLIST ================= */}
        {activeTab === "analysis" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
                On-Page SEO Audit Results ({analysis.goodCount} Good, {analysis.warningCount} Warnings, {analysis.errorCount} Errors)
              </h4>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {analysis.checks.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: 12,
                    borderRadius: 6,
                    background: item.status === "good" ? "#f6fbf7" : item.status === "warning" ? "#fffcf0" : "#fdf4f4",
                    border: `1px solid ${
                      item.status === "good" ? "#d1ebd6" : item.status === "warning" ? "#fcebb6" : "#f7d2d3"
                    }`,
                  }}
                >
                  <div style={{ marginTop: 2 }}>
                    {item.status === "good" && <CheckCircle size={16} color="#00a32a" />}
                    {item.status === "warning" && <AlertTriangle size={16} color="#dba617" />}
                    {item.status === "error" && <XCircle size={16} color="#d63638" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1d2327" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 13, color: "#50575e", marginTop: 2 }}>
                      {item.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: ADVANCED ================= */}
        {activeTab === "advanced" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Search Engine Robots Settings</h4>

            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={Boolean(seo.noindex)}
                onChange={(e) => updateSeoField("noindex", e.target.checked)}
              />
              <div>
                <strong style={{ fontSize: 14 }}>Discourage search engines from indexing this page (noindex)</strong>
                <div style={{ fontSize: 12, color: "#646970" }}>
                  When enabled, search engines will be instructed not to list this page in search results.
                </div>
              </div>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={Boolean(seo.nofollow)}
                onChange={(e) => updateSeoField("nofollow", e.target.checked)}
              />
              <div>
                <strong style={{ fontSize: 14 }}>Discourage search engines from following links on this page (nofollow)</strong>
                <div style={{ fontSize: 12, color: "#646970" }}>
                  When enabled, search engines will not follow links embedded on this page.
                </div>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Media Picker Modal for OG Image Selection */}
      {showMediaPicker && (
        <MediaPicker
          isOpen={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
          onSelect={(media) => {
            updateSeoField("ogImage", media.url);
            setShowMediaPicker(false);
          }}
        />
      )}
    </div>
  );
}
