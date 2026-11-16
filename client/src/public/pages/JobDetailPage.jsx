import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Briefcase, MapPin, Clock, Calendar, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { apiClient } from "../../api/apiClient";

export function JobDetailPage() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Application Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/api/jobs/${slug}`);
        setJob(res.data);
      } catch (err) {
        setError("Job posting not found or no longer accepting applications.");
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [slug]);

  const handleApply = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setFormError("Full Name, Email, and Phone number are required.");
      return;
    }

    if (!resumeFile) {
      setFormError("Please upload your resume file (PDF, DOC, or DOCX).");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      formData.append("coverNote", coverNote.trim());
      formData.append("resume", resumeFile);

      const response = await fetch(`/api/jobs/${slug}/apply`, {
        method: "POST",
        body: formData,
      });

      const json = await response.json();
      if (!response.ok || !json.ok) {
        throw new Error(json.error || "Failed to submit application.");
      }

      setSubmitted(true);
    } catch (err) {
      setFormError(err.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px", textAlign: "center", color: "#6b7280" }}>
        Loading job posting details...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <Helmet>
          <title>Job Posting Not Found | Emmbros Autocomp</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Job Posting Closed or Not Found</h1>
        <p style={{ color: "#4b5563", marginBottom: 24 }}>This vacancy is either closed or no longer accepting applications.</p>
        <Link to="/career" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
          <ArrowLeft size={16} /> View All Careers
        </Link>
      </div>
    );
  }

  const seoTitle = job.seo?.metaTitle || `${job.title} Job opening in Baddi | Emmbros Autocomp`;
  const seoDesc = job.seo?.metaDescription || `Apply for ${job.title} position in ${job.department} at Emmbros Autocomp Ltd, Baddi. ${job.experience} experience required.`;
  const canonicalUrl = job.seo?.canonicalUrl || `https://emmbros.com/careers/${job.slug}`;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px 80px 20px" }}>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph Tags */}
        <meta property="og:title" content={job.seo?.ogTitle || seoTitle} />
        <meta property="og:description" content={job.seo?.ogDescription || seoDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>

      {/* Back Link */}
      <Link to="/career" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#4b5563", fontSize: 14, fontWeight: 500, textDecoration: "none", marginBottom: 24 }}>
        <ArrowLeft size={16} /> Back to Open Positions
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32 }}>
        {/* Main Job Content (Left) */}
        <div>
          <span style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 16, display: "inline-block", marginBottom: 12 }}>
            {job.department}
          </span>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111827", lineHeight: 1.25, marginBottom: 16 }}>
            {job.title}
          </h1>

          <div style={{ display: "flex", gap: 20, fontSize: 14, color: "#4b5563", marginBottom: 28, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <MapPin size={16} /> {job.location || "Baddi, Himachal Pradesh"}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Briefcase size={16} /> {job.employmentType}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Clock size={16} /> {job.experience}
            </span>
            {job.applyByDate && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#d97706" }}>
                <Calendar size={16} /> Apply By: {new Date(job.applyByDate).toLocaleDateString("en-IN")}
              </span>
            )}
          </div>

          {/* Job Overview */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 24, marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>Role Overview</h2>
            <div
              style={{ fontSize: 16, lineHeight: 1.6, color: "#374151" }}
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>Key Responsibilities</h2>
              <ul style={{ paddingLeft: 20, fontSize: 16, lineHeight: 1.6, color: "#374151" }}>
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} style={{ marginBottom: 8 }}>{resp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>Qualifications & Requirements</h2>
              <ul style={{ paddingLeft: 20, fontSize: 16, lineHeight: 1.6, color: "#374151" }}>
                {job.requirements.map((req, idx) => (
                  <li key={idx} style={{ marginBottom: 8 }}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Application Form Box (Right) */}
        <div>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", position: "sticky", top: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
              Apply for this Position
            </h3>

            {submitted ? (
              <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 8, padding: 20, textAlign: "center" }}>
                <CheckCircle size={32} color="#059669" style={{ marginBottom: 8 }} />
                <h4 style={{ fontSize: 16, fontWeight: 700, color: "#065f46" }}>Application Submitted!</h4>
                <p style={{ fontSize: 14, color: "#047857", marginTop: 6 }}>
                  Thank you for applying. Our HR recruitment team will review your application and contact you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {formError && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: 10, borderRadius: 6, fontSize: 13 }}>
                    {formError}
                  </div>
                )}

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Full Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Email Address *</label>
                  <input
                    type="email"
                    className="admin-input"
                    placeholder="rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Phone Number *</label>
                  <input
                    type="tel"
                    className="admin-input"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>
                    Resume File (PDF/DOC, Max 5 MB) *
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0] || null)}
                    style={{ fontSize: 13 }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>Cover Note / Message</label>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    placeholder="Briefly describe your relevant experience..."
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "10px", fontSize: 14 }}
                  disabled={submitting}
                >
                  <Send size={15} />
                  <span>{submitting ? "Submitting..." : "Submit Application"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
