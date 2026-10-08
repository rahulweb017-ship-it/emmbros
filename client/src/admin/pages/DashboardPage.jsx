import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Briefcase,
  Image as ImageIcon,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  UserCheck,
} from "lucide-react";
import { apiClient } from "../../api/apiClient";
import { StatusBadge } from "../components/StatusBadge";
import { LoadingSpinner } from "../components/LoadingSpinner";

export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    publishedPosts: 0,
    draftPosts: 0,
    openJobs: 0,
    mediaCount: 0,
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const [postsRes, jobsRes, mediaRes, logsRes] = await Promise.all([
          apiClient.get("/api/admin/posts?limit=5"),
          apiClient.get("/api/admin/jobs?limit=5"),
          apiClient.get("/api/admin/media?limit=1"),
          apiClient.get("/api/admin/activity-logs?limit=8"),
        ]);

        const posts = postsRes.data || [];
        const jobs = jobsRes.data || [];
        const mediaTotal = mediaRes.pagination?.total || 0;
        const logs = logsRes.data || [];

        const published = posts.filter((p) => p.status === "published").length;
        const drafts = posts.filter((p) => p.status === "draft").length;
        const open = jobs.filter((j) => j.status === "open").length;

        setStats({
          publishedPosts: postsRes.pagination?.total ? published : posts.length,
          draftPosts: drafts,
          openJobs: jobsRes.pagination?.total ? open : jobs.length,
          mediaCount: mediaTotal,
        });

        setRecentPosts(posts);
        setRecentJobs(jobs);
        setActivityLogs(logs);
      } catch (err) {
        console.error("Error fetching dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Fetching live dashboard metrics..." />;
  }

  return (
    <div className="admin-dashboard-view">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-subtitle">Welcome to Emmbros Autocomp Admin & Content Management</p>
        </div>
        <div className="flex-row-gap">
          <Link to="/admin/posts/new" className="admin-btn admin-btn-primary">
            <Plus size={16} />
            <span>New Post</span>
          </Link>
          <Link to="/admin/jobs/new" className="admin-btn admin-btn-secondary">
            <Plus size={16} />
            <span>Post Job</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon blue">
            <FileText size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{stats.publishedPosts}</span>
            <span className="admin-stat-label">Published Blog Posts</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon amber">
            <TrendingUp size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{stats.draftPosts}</span>
            <span className="admin-stat-label">Draft Posts</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon green">
            <Briefcase size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{stats.openJobs}</span>
            <span className="admin-stat-label">Active Job Openings</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon purple">
            <ImageIcon size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{stats.mediaCount}</span>
            <span className="admin-stat-label">Media Library Files</span>
          </div>
        </div>
      </div>

      {/* Recent Activity & Logs Grid */}
      <div className="admin-dashboard-grid">
        {/* Recent Posts */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Recent Blog Posts</h2>
            <Link to="/admin/posts" className="admin-btn admin-btn-secondary" style={{ padding: "4px 8px", fontSize: 12 }}>
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <p className="admin-form-hint">No blog posts created yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post) => (
                  <tr key={post._id}>
                    <td>
                      <strong>{post.title}</strong>
                      <br />
                      <span className="admin-form-hint">/{post.slug}</span>
                    </td>
                    <td>{post.category || "General"}</td>
                    <td>
                      <StatusBadge status={post.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Audit Activity Log Feed */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={18} color="#2271b1" />
              <h2 className="admin-card-title">Audit Activity Feed</h2>
            </div>
            <span style={{ fontSize: 12, color: "#646970" }}>Live System Audit</span>
          </div>

          {activityLogs.length === 0 ? (
            <p className="admin-form-hint">No activity logged yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {activityLogs.map((log) => (
                <div
                  key={log._id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: "#f6f7f7",
                    border: "1px solid #f0f0f1",
                  }}
                >
                  <UserCheck size={16} color="#0073aa" style={{ marginTop: 2 }} />
                  <div style={{ flex: 1, fontSize: 13 }}>
                    <div>
                      <strong>{log.userName}</strong> ({log.action.replace(/_/g, " ")})
                    </div>
                    <div style={{ fontSize: 12, color: "#50575e", marginTop: 2 }}>{log.details}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#8c8f94", whiteSpace: "nowrap" }}>
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
