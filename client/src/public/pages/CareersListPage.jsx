import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Briefcase, MapPin, Clock, ArrowRight, Search } from "lucide-react";
import { apiClient } from "../../api/apiClient";

export function CareersListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const department = searchParams.get("department") || "";
  const searchQuery = searchParams.get("search") || "";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          ...(department && { department }),
          ...(searchQuery && { search: searchQuery }),
        });
        const res = await apiClient.get(`/api/jobs?${params}`);
        setJobs(res.data || []);

        if (res.data) {
          const deps = [...new Set(res.data.map((j) => j.department).filter(Boolean))];
          setDepartments(deps);
        }
      } catch (err) {
        console.error("Failed to load job listings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [department, searchQuery]);

  return (
    <div className="public-careers-view" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      <Helmet>
        <title>Careers & Open Job Vacancies | Emmbros Autocomp</title>
        <meta
          name="description"
          content="Explore career opportunities in automotive forging, CNC machining, metallurgy, and engineering at Emmbros Autocomp Ltd in Baddi, Himachal Pradesh."
        />
        <link rel="canonical" href="https://emmbros.com/careers" />
        <meta property="og:title" content="Careers & Open Job Vacancies | Emmbros Autocomp" />
        <meta
          property="og:description"
          content="Join Emmbros Autocomp Ltd. Explore career opportunities in automotive forging, quality engineering, and supply chain management."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://emmbros.com/careers" />
      </Helmet>

      {/* Hero Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#111827", marginBottom: 12 }}>
          Careers at Emmbros Autocomp
        </h1>
        <p style={{ fontSize: 16, color: "#4b5563", maxWidth: 640, margin: "0 auto" }}>
          Build your career with a leading Tier-1 manufacturer of automotive forged components in Baddi. Join our innovative engineering and manufacturing team!
        </p>
      </div>

      {/* Filter Options */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            style={{
              background: !department ? "#2271b1" : "#f0f0f1",
              color: !department ? "#fff" : "#2c3338",
              border: "none",
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 13,
              cursor: "pointer",
            }}
            onClick={() => setSearchParams({})}
          >
            All Departments
          </button>
          {departments.map((dep) => (
            <button
              key={dep}
              type="button"
              style={{
                background: department === dep ? "#2271b1" : "#f0f0f1",
                color: department === dep ? "#fff" : "#2c3338",
                border: "none",
                borderRadius: 20,
                padding: "6px 16px",
                fontSize: 13,
                cursor: "pointer",
              }}
              onClick={() => setSearchParams({ department: dep })}
            >
              {dep}
            </button>
          ))}
        </div>
      </div>

      {/* Job Openings Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
          Loading open vacancies...
        </div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "#f9fafb", borderRadius: 12 }}>
          <h3 style={{ fontSize: 18, color: "#374151" }}>No open job vacancies right now</h3>
          <p style={{ color: "#6b7280", marginTop: 8 }}>Check back soon or send your resume to careers@emmbros.com!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {jobs.map((job) => (
            <div
              key={job._id}
              style={{
                background: "#fff",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                padding: 24,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div>
                <span
                  style={{
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 12,
                    display: "inline-block",
                    marginBottom: 8,
                  }}
                >
                  {job.department}
                </span>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "4px 0 8px 0" }}>
                  <Link to={`/careers/${job.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {job.title}
                  </Link>
                </h2>

                <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#6b7280", flexWrap: "wrap" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <MapPin size={14} /> {job.location || "Baddi, Himachal Pradesh"}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <Briefcase size={14} /> {job.employmentType}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <Clock size={14} /> {job.experience}
                  </span>
                </div>
              </div>

              <Link
                to={`/careers/${job.slug}`}
                className="admin-btn admin-btn-primary"
                style={{
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  textDecoration: "none",
                  borderRadius: 6,
                }}
              >
                <span>View & Apply</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
