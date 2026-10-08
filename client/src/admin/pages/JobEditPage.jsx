import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  MoveUp,
  MoveDown,
  Users,
} from "lucide-react";
import { apiClient } from "../../api/apiClient";
import { RichTextEditor } from "../components/RichTextEditor";
import { FormField } from "../components/FormField";
import { SeoPanel } from "../components/SeoPanel";
import { useToast } from "../context/ToastContext";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export function JobEditPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugCustom, setIsSlugCustom] = useState(false);
  const [department, setDepartment] = useState("Engineering");
  const [location, setLocation] = useState("Baddi, Himachal Pradesh");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [experience, setExperience] = useState("2 - 5 Years");
  const [salaryRange, setSalaryRange] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState([""]);
  const [requirements, setRequirements] = useState([""]);
  const [applyByDate, setApplyByDate] = useState("");
  const [status, setStatus] = useState("open");
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

  // Load existing job details if editing
  useEffect(() => {
    if (!isEditing) return;

    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/api/admin/jobs/${id}`);
        const job = res.data;
        if (job) {
          setTitle(job.title || "");
          setSlug(job.slug || "");
          setIsSlugCustom(true);
          setDepartment(job.department || "Engineering");
          setLocation(job.location || "Baddi, Himachal Pradesh");
          setEmploymentType(job.employmentType || "Full-time");
          setExperience(job.experience || "");
          setSalaryRange(job.salaryRange || "");
          setDescription(job.description || "");
          setResponsibilities(job.responsibilities?.length ? job.responsibilities : [""]);
          setRequirements(job.requirements?.length ? job.requirements : [""]);
          setApplyByDate(
            job.applyByDate ? new Date(job.applyByDate).toISOString().split("T")[0] : ""
          );
          setStatus(job.status || "open");
          setSeo(
            job.seo || {
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
        toast.error("Failed to load job posting details.");
        navigate("/admin/jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, isEditing]);

  // Handle Title change & Auto-slug
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    setIsDirty(true);
    if (!isSlugCustom) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (e) => {
    setSlug(slugify(e.target.value));
    setIsSlugCustom(true);
    setIsDirty(true);
  };

  // Responsibilities List Actions
  const handleAddResponsibility = () => {
    setResponsibilities([...responsibilities, ""]);
    setIsDirty(true);
  };

  const handleUpdateResponsibility = (index, val) => {
    const updated = [...responsibilities];
    updated[index] = val;
    setResponsibilities(updated);
    setIsDirty(true);
  };

  const handleRemoveResponsibility = (index) => {
    if (responsibilities.length === 1) {
      setResponsibilities([""]);
    } else {
      setResponsibilities(responsibilities.filter((_, i) => i !== index));
    }
    setIsDirty(true);
  };

  const handleMoveResponsibility = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= responsibilities.length) return;
    const updated = [...responsibilities];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setResponsibilities(updated);
    setIsDirty(true);
  };

  // Requirements List Actions
  const handleAddRequirement = () => {
    setRequirements([...requirements, ""]);
    setIsDirty(true);
  };

  const handleUpdateRequirement = (index, val) => {
    const updated = [...requirements];
    updated[index] = val;
    setRequirements(updated);
    setIsDirty(true);
  };

  const handleRemoveRequirement = (index) => {
    if (requirements.length === 1) {
      setRequirements([""]);
    } else {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
    setIsDirty(true);
  };

  const handleMoveRequirement = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= requirements.length) return;
    const updated = [...requirements];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setRequirements(updated);
    setIsDirty(true);
  };

  // Save / Publish
  const handleSave = async (targetStatus = status) => {
    if (!title.trim()) {
      toast.error("Job title is required.");
      return;
    }
    if (!department.trim()) {
      toast.error("Department is required.");
      return;
    }
    if (!experience.trim()) {
      toast.error("Experience requirement is required.");
      return;
    }
    if (!description.trim()) {
      toast.error("Job description is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        department: department.trim(),
        location: location.trim(),
        employmentType,
        experience: experience.trim(),
        salaryRange: salaryRange.trim(),
        description,
        responsibilities: responsibilities.filter((r) => r.trim() !== ""),
        requirements: requirements.filter((r) => r.trim() !== ""),
        applyByDate: applyByDate ? new Date(applyByDate).toISOString() : null,
        status: targetStatus,
        seo,
      };

      if (isEditing) {
        await apiClient.put(`/api/admin/jobs/${id}`, payload);
        toast.success("Job posting updated successfully!");
      } else {
        const res = await apiClient.post("/api/admin/jobs", payload);
        toast.success("Job posting created successfully!");
        navigate(`/admin/jobs/${res.data._id}`, { replace: true });
      }

      setIsDirty(false);
    } catch (err) {
      toast.error(err.message || "Failed to save job posting.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading" style={{ padding: 40, textAlign: "center" }}>
        Loading job posting details...
      </div>
    );
  }

  return (
    <div className="admin-job-edit-view">
      {/* Top Header */}
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            className="admin-btn-icon"
            onClick={() => navigate("/admin/jobs")}
            title="Back to Job List"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="admin-page-title">
              {isEditing ? `Edit Job: ${title || "Untitled"}` : "Post New Job"}
            </h1>
            <p className="admin-page-subtitle">
              {isEditing ? "Modify job posting details and requirements" : "Create a new career opportunity listing"}
            </p>
          </div>
        </div>

        <div className="flex-row-gap">
          {isEditing && (
            <Link
              to={`/admin/jobs/${id}/applications`}
              className="admin-btn admin-btn-secondary"
            >
              <Users size={16} />
              <span>View Applicants</span>
            </Link>
          )}
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => handleSave("draft")}
            disabled={saving}
          >
            Save Draft
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => handleSave(status)}
            disabled={saving}
          >
            <Save size={16} />
            <span>{saving ? "Saving..." : isEditing ? "Update Job" : "Publish Job"}</span>
          </button>
        </div>
      </div>

      {/* 2-Column WordPress Layout */}
      <div className="admin-post-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        {/* Main Content (Left Column) */}
        <div className="admin-post-main" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Title & Slug */}
          <div className="admin-card" style={{ background: "#fff", padding: 20, borderRadius: 8, border: "1px solid #dcdcde" }}>
            <FormField label="Job Title" required>
              <input
                type="text"
                className="admin-input"
                style={{ fontSize: 18, fontWeight: 600 }}
                placeholder="e.g. Senior Mechanical Engineer / Supply Chain Executive"
                value={title}
                onChange={handleTitleChange}
              />
            </FormField>

            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#50575e", display: "block", marginBottom: 4 }}>
                PERMALINK SLUG
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: "#646970" }}>/jobs/</span>
                <input
                  type="text"
                  className="admin-input"
                  style={{ flex: 1, fontSize: 13 }}
                  value={slug}
                  onChange={handleSlugChange}
                />
              </div>
            </div>
          </div>

          {/* Key Job Specifications Grid */}
          <div className="admin-card" style={{ background: "#fff", padding: 20, borderRadius: 8, border: "1px solid #dcdcde" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Key Specifications</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <FormField label="Department" required>
                <select
                  className="admin-select"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setIsDirty(true);
                  }}
                >
                  <option value="Engineering">Engineering & Design</option>
                  <option value="Operations & Manufacturing">Operations & Manufacturing</option>
                  <option value="Quality Control & QA">Quality Control & QA</option>
                  <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Finance & Accounts">Finance & Accounts</option>
                  <option value="General Management">General Management</option>
                </select>
              </FormField>

              <FormField label="Location">
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Baddi, Himachal Pradesh"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setIsDirty(true);
                  }}
                />
              </FormField>

              <FormField label="Employment Type">
                <select
                  className="admin-select"
                  value={employmentType}
                  onChange={(e) => {
                    setEmploymentType(e.target.value);
                    setIsDirty(true);
                  }}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </FormField>

              <FormField label="Experience Required" required>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. 3 - 5 Years"
                  value={experience}
                  onChange={(e) => {
                    setExperience(e.target.value);
                    setIsDirty(true);
                  }}
                />
              </FormField>

              <FormField label="Salary Range (Optional)" hint="Disclosed to applicants or kept confidential">
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. ₹5,00,000 - ₹8,00,000 P.A. or As per industry standards"
                  value={salaryRange}
                  onChange={(e) => {
                    setSalaryRange(e.target.value);
                    setIsDirty(true);
                  }}
                />
              </FormField>
            </div>
          </div>

          {/* Rich Text Job Description */}
          <div className="admin-card" style={{ background: "#fff", padding: 20, borderRadius: 8, border: "1px solid #dcdcde" }}>
            <FormField label="Job Description & Overview" required hint="Detailed overview of the role and team">
              <RichTextEditor
                content={description}
                onChange={(html) => {
                  setDescription(html);
                  setIsDirty(true);
                }}
              />
            </FormField>
          </div>

          {/* Responsibilities List Component */}
          <div className="admin-card" style={{ background: "#fff", padding: 20, borderRadius: 8, border: "1px solid #dcdcde" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Key Responsibilities</h3>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                style={{ padding: "4px 10px", fontSize: 13 }}
                onClick={handleAddResponsibility}
              >
                <Plus size={14} /> Add Item
              </button>
            </div>
            <p style={{ fontSize: 13, color: "#646970", marginBottom: 14 }}>
              List the primary duties and day-to-day tasks expected for this position.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {responsibilities.map((resp, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#8c8f94", width: 24 }}>
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ flex: 1 }}
                    placeholder="Enter responsibility..."
                    value={resp}
                    onChange={(e) => handleUpdateResponsibility(idx, e.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-btn-icon"
                    title="Move Up"
                    disabled={idx === 0}
                    onClick={() => handleMoveResponsibility(idx, -1)}
                  >
                    <MoveUp size={14} color={idx === 0 ? "#ccc" : "#50575e"} />
                  </button>
                  <button
                    type="button"
                    className="admin-btn-icon"
                    title="Move Down"
                    disabled={idx === responsibilities.length - 1}
                    onClick={() => handleMoveResponsibility(idx, 1)}
                  >
                    <MoveDown size={14} color={idx === responsibilities.length - 1 ? "#ccc" : "#50575e"} />
                  </button>
                  <button
                    type="button"
                    className="admin-btn-icon"
                    title="Delete Item"
                    onClick={() => handleRemoveResponsibility(idx)}
                  >
                    <Trash2 size={14} color="#d63638" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements List Component */}
          <div className="admin-card" style={{ background: "#fff", padding: 20, borderRadius: 8, border: "1px solid #dcdcde" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Qualifications & Requirements</h3>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                style={{ padding: "4px 10px", fontSize: 13 }}
                onClick={handleAddRequirement}
              >
                <Plus size={14} /> Add Item
              </button>
            </div>
            <p style={{ fontSize: 13, color: "#646970", marginBottom: 14 }}>
              Specify required educational degrees, technical skillsets, and certifications.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {requirements.map((req, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#8c8f94", width: 24 }}>
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ flex: 1 }}
                    placeholder="Enter requirement..."
                    value={req}
                    onChange={(e) => handleUpdateRequirement(idx, e.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-btn-icon"
                    title="Move Up"
                    disabled={idx === 0}
                    onClick={() => handleMoveRequirement(idx, -1)}
                  >
                    <MoveUp size={14} color={idx === 0 ? "#ccc" : "#50575e"} />
                  </button>
                  <button
                    type="button"
                    className="admin-btn-icon"
                    title="Move Down"
                    disabled={idx === requirements.length - 1}
                    onClick={() => handleMoveRequirement(idx, 1)}
                  >
                    <MoveDown size={14} color={idx === requirements.length - 1 ? "#ccc" : "#50575e"} />
                  </button>
                  <button
                    type="button"
                    className="admin-btn-icon"
                    title="Delete Item"
                    onClick={() => handleRemoveRequirement(idx)}
                  >
                    <Trash2 size={14} color="#d63638" />
                  </button>
                </div>
              ))}
            </div>
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
            content={description}
            section="careers"
            type="job"
          />
        </div>

        {/* Sidebar (Right Column) */}
        <div className="admin-post-sidebar" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Status & Deadline Box */}
          <div className="admin-card" style={{ background: "#fff", padding: 20, borderRadius: 8, border: "1px solid #dcdcde" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Publish Settings</h3>

            <FormField label="Posting Status">
              <select
                className="admin-select"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setIsDirty(true);
                }}
              >
                <option value="open">Open (Accepting Applications)</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </FormField>

            <FormField label="Application Deadline (Apply By Date)" hint="Job auto-closes after this date">
              <div style={{ position: "relative" }}>
                <input
                  type="date"
                  className="admin-input"
                  value={applyByDate}
                  onChange={(e) => {
                    setApplyByDate(e.target.value);
                    setIsDirty(true);
                  }}
                />
              </div>
            </FormField>

            <div style={{ borderTop: "1px solid #f0f0f1", paddingTop: 16, marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => handleSave(status)}
                disabled={saving}
              >
                <Save size={16} />
                <span>{saving ? "Saving..." : isEditing ? "Update Job" : "Publish Job"}</span>
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => navigate(`/admin/jobs/${id}/applications`)}
                >
                  <Users size={16} />
                  <span>View Applicants</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
