import { useEffect, useState } from "react";
import { Save, ShieldCheck, Globe, Mail, Phone, Share2, Code, Image as ImageIcon } from "lucide-react";
import { apiClient } from "../../api/apiClient";
import { FormField } from "../components/FormField";
import { MediaPicker } from "../components/MediaPicker";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export function SettingsPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const [settings, setSettings] = useState({
    siteName: "Emmbros Autocomp Ltd",
    tagline: "Leading Automotive Forging Manufacturer",
    logo: "/wp-content/uploads/2025/12/logo1.webp",
    favicon: "/favicon.ico",
    contactDetails: {
      address: "Plot No 46, Phase 1, Baddi, Himachal Pradesh 173205, India",
      phone: "+91-1795-244500",
      secondaryPhone: "+91-1795-244501",
      email: "enquiry@emmbros.com",
    },
    socialLinks: {
      facebook: "",
      linkedin: "",
      twitter: "",
      youtube: "",
      instagram: "",
    },
    defaultSeoTitleTemplate: "%title% | Emmbros Autocomp Ltd",
    defaultOgImage: "/wp-content/uploads/2025/12/logo1.webp",
    googleAnalyticsId: "",
    searchConsoleCode: "",
    customHeadScripts: "",
    customFooterScripts: "",
  });

  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaTarget, setMediaTarget] = useState("logo");

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      try {
        const res = await apiClient.get("/api/admin/settings");
        if (res.data) setSettings(res.data);
      } catch (err) {
        toast.error("Failed to load site settings.");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await apiClient.put("/api/admin/settings", settings);
      toast.success("Site settings updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading site configuration..." size="large" />;
  }

  return (
    <div className="admin-settings-view">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Site Settings & Configuration</h1>
          <p className="admin-page-subtitle">Manage branding, contact info, default SEO tags, and tracking scripts</p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={16} />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "1px solid #dcdcde", paddingBottom: 10 }}>
        <button
          type="button"
          className={`admin-btn ${activeTab === "general" ? "admin-btn-primary" : "admin-btn-secondary"}`}
          onClick={() => setActiveTab("general")}
        >
          <Globe size={14} /> General & Branding
        </button>
        <button
          type="button"
          className={`admin-btn ${activeTab === "contact" ? "admin-btn-primary" : "admin-btn-secondary"}`}
          onClick={() => setActiveTab("contact")}
        >
          <Phone size={14} /> Contact Details
        </button>
        <button
          type="button"
          className={`admin-btn ${activeTab === "social" ? "admin-btn-primary" : "admin-btn-secondary"}`}
          onClick={() => setActiveTab("social")}
        >
          <Share2 size={14} /> Social Links
        </button>
        <button
          type="button"
          className={`admin-btn ${activeTab === "seo" ? "admin-btn-primary" : "admin-btn-secondary"}`}
          onClick={() => setActiveTab("seo")}
        >
          <ShieldCheck size={14} /> Default SEO & Analytics
        </button>
        <button
          type="button"
          className={`admin-btn ${activeTab === "scripts" ? "admin-btn-primary" : "admin-btn-secondary"}`}
          onClick={() => setActiveTab("scripts")}
        >
          <Code size={14} /> Custom Scripts
        </button>
      </div>

      <div className="admin-card" style={{ padding: 24, background: "#fff", borderRadius: 8, border: "1px solid #dcdcde" }}>
        {/* Tab 1: General Branding */}
        {activeTab === "general" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FormField label="Site Title / Company Name" required>
              <input
                type="text"
                className="admin-input"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </FormField>

            <FormField label="Tagline / Subtitle">
              <input
                type="text"
                className="admin-input"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              />
            </FormField>

            <FormField label="Website Logo">
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {settings.logo && (
                  <img src={settings.logo} alt="Logo" style={{ height: 40, objectFit: "contain" }} />
                )}
                <input
                  type="text"
                  className="admin-input"
                  style={{ flex: 1 }}
                  value={settings.logo}
                  onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => {
                    setMediaTarget("logo");
                    setShowMediaPicker(true);
                  }}
                >
                  <ImageIcon size={14} /> Choose Image
                </button>
              </div>
            </FormField>

            <FormField label="Favicon Path">
              <input
                type="text"
                className="admin-input"
                value={settings.favicon}
                onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
              />
            </FormField>
          </div>
        )}

        {/* Tab 2: Contact Details */}
        {activeTab === "contact" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FormField label="Physical Manufacturing Address">
              <textarea
                className="admin-textarea"
                rows={3}
                value={settings.contactDetails?.address || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contactDetails: { ...settings.contactDetails, address: e.target.value },
                  })
                }
              />
            </FormField>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <FormField label="Primary Phone Number">
                <input
                  type="text"
                  className="admin-input"
                  value={settings.contactDetails?.phone || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contactDetails: { ...settings.contactDetails, phone: e.target.value },
                    })
                  }
                />
              </FormField>

              <FormField label="Secondary Phone Number">
                <input
                  type="text"
                  className="admin-input"
                  value={settings.contactDetails?.secondaryPhone || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contactDetails: { ...settings.contactDetails, secondaryPhone: e.target.value },
                    })
                  }
                />
              </FormField>
            </div>

            <FormField label="Official Contact Email">
              <input
                type="email"
                className="admin-input"
                value={settings.contactDetails?.email || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contactDetails: { ...settings.contactDetails, email: e.target.value },
                  })
                }
              />
            </FormField>
          </div>
        )}

        {/* Tab 3: Social Links */}
        {activeTab === "social" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FormField label="LinkedIn Page URL">
              <input
                type="url"
                className="admin-input"
                placeholder="https://linkedin.com/company/emmbros"
                value={settings.socialLinks?.linkedin || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                  })
                }
              />
            </FormField>

            <FormField label="Facebook Page URL">
              <input
                type="url"
                className="admin-input"
                placeholder="https://facebook.com/emmbros"
                value={settings.socialLinks?.facebook || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                  })
                }
              />
            </FormField>

            <FormField label="Twitter / X Profile URL">
              <input
                type="url"
                className="admin-input"
                placeholder="https://twitter.com/emmbros"
                value={settings.socialLinks?.twitter || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                  })
                }
              />
            </FormField>

            <FormField label="YouTube Channel URL">
              <input
                type="url"
                className="admin-input"
                placeholder="https://youtube.com/@emmbros"
                value={settings.socialLinks?.youtube || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, youtube: e.target.value },
                  })
                }
              />
            </FormField>
          </div>
        )}

        {/* Tab 4: Default SEO & Analytics */}
        {activeTab === "seo" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FormField label="Default SEO Title Template" hint="Use %title% for page title substitution">
              <input
                type="text"
                className="admin-input"
                value={settings.defaultSeoTitleTemplate}
                onChange={(e) => setSettings({ ...settings, defaultSeoTitleTemplate: e.target.value })}
              />
            </FormField>

            <FormField label="Default Social Sharing Image (OG Image)">
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {settings.defaultOgImage && (
                  <img src={settings.defaultOgImage} alt="OG Default" style={{ height: 40, objectFit: "cover", borderRadius: 4 }} />
                )}
                <input
                  type="text"
                  className="admin-input"
                  style={{ flex: 1 }}
                  value={settings.defaultOgImage}
                  onChange={(e) => setSettings({ ...settings, defaultOgImage: e.target.value })}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => {
                    setMediaTarget("defaultOgImage");
                    setShowMediaPicker(true);
                  }}
                >
                  <ImageIcon size={14} /> Select Image
                </button>
              </div>
            </FormField>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <FormField label="Google Analytics Measurement ID (G-XXXXXXX)">
                <input
                  type="text"
                  className="admin-input"
                  placeholder="G-1234567890"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                />
              </FormField>

              <FormField label="Google Search Console Verification Meta Tag Code">
                <input
                  type="text"
                  className="admin-input"
                  placeholder="google-site-verification=XXXXX"
                  value={settings.searchConsoleCode}
                  onChange={(e) => setSettings({ ...settings, searchConsoleCode: e.target.value })}
                />
              </FormField>
            </div>
          </div>
        )}

        {/* Tab 5: Custom Scripts */}
        {activeTab === "scripts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FormField label="Custom Header Scripts (Injected into <head>)" hint="e.g. Google Tag Manager, custom meta tags">
              <textarea
                className="admin-textarea"
                rows={5}
                placeholder="<!-- Custom Head Code -->"
                value={settings.customHeadScripts}
                onChange={(e) => setSettings({ ...settings, customHeadScripts: e.target.value })}
              />
            </FormField>

            <FormField label="Custom Footer Scripts (Injected before </body>)" hint="e.g. Live chat widgets, tracking pixels">
              <textarea
                className="admin-textarea"
                rows={5}
                placeholder="<!-- Custom Footer Code -->"
                value={settings.customFooterScripts}
                onChange={(e) => setSettings({ ...settings, customFooterScripts: e.target.value })}
              />
            </FormField>
          </div>
        )}
      </div>

      {showMediaPicker && (
        <MediaPicker
          isOpen={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
          onSelect={(media) => {
            if (mediaTarget === "logo") setSettings({ ...settings, logo: media.url });
            if (mediaTarget === "defaultOgImage") setSettings({ ...settings, defaultOgImage: media.url });
            setShowMediaPicker(false);
          }}
        />
      )}
    </div>
  );
}
