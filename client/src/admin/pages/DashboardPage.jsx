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
  FileCode,
  ArrowRightLeft,
  ExternalLink,
  Clock,
  Sparkles,
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
    pagesCount: 0,
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const [postsRes, jobsRes, mediaRes, pagesRes, logsRes] = await Promise.all([
          apiClient.get("/api/admin/posts?limit=5"),
          apiClient.get("/api/admin/jobs?limit=5"),
          apiClient.get("/api/admin/media?limit=1"),
          apiClient.get("/api/admin/pages?limit=1"),
          apiClient.get("/api/admin/activity-logs?limit=8"),
        ]);

        const posts = postsRes.data || [];
        const jobs = jobsRes.data || [];
        const mediaTotal = mediaRes.pagination?.total || 0;
        const pagesTotal = pagesRes.pagination?.total || 0;
        const logs = logsRes.data || [];

        const published = posts.filter((p) => p.status === "published").length;
        const drafts = posts.filter((p) => p.status === "draft").length;
        const open = jobs.filter((j) => j.status === "open").length;

        setStats({
          publishedPosts: postsRes.pagination?.total ? published : posts.length,
          draftPosts: drafts,
          openJobs: jobsRes.pagination?.total ? open : jobs.length,
          mediaCount: mediaTotal,
          pagesCount: pagesTotal,
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
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-badge-pill">
            <Sparkles size={13} />
            <span>Admin Control Center</span>
          </div>
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-subtitle">
            Welcome to Emmbros Autocomp content management & SEO console
          </p>
        </div>
        <div className="flex-row-gap" style={{ display: "flex", gap: "10px" }}>
          <Link to="/admin/pages" className="admin-btn admin-btn-secondary">
            <FileCode size={15} />
            <span>Pages & SEO</span>
          </Link>
          <Link to="/admin/posts/new" className="admin-btn admin-btn-primary">
            <Plus size={16} />
            <span>New Post</span>
          </Link>
          <Link to="/admin/jobs/new" className="admin-btn admin-btn-primary">
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

      {/* Quick Action Shortcuts Banner */}
      <div className="admin-quick-links-bar">
        <span className="admin-quick-links-title">Quick Navigation:</span>
        <div className="admin-quick-pills">
          <Link to="/admin/pages" className="admin-quick-pill">
            <FileCode size={13} />
            <span>16 Website Pages & SEO</span>
          </Link>
          <Link to="/admin/redirects" className="admin-quick-pill">
            <ArrowRightLeft size={13} />
            <span>301 Redirect Rules</span>
          </Link>
          <Link to="/admin/media" className="admin-quick-pill">
            <ImageIcon size={13} />
            <span>Media Library</span>
          </Link>
          <a href="/" target="_blank" rel="noreferrer" className="admin-quick-pill external">
            <ExternalLink size={13} />
            <span>Visit Live Website</span>
          </a>
        </div>
      </div>

      {/* Recent Activity & Logs Grid */}
      <div className="admin-dashboard-grid">
        {/* Recent Posts */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Recent Blog Posts</h2>
              <span className="admin-card-caption">Latest articles published on website</span>
            </div>
            <Link to="/admin/posts" className="admin-link-btn">
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="admin-empty-box">
              <FileText size={32} className="admin-empty-icon" />
              <p className="admin-empty-title">No blog posts created yet</p>
              <p className="admin-empty-text">Create your first blog post to populate your technical insights feed.</p>
              <Link to="/admin/posts/new" className="admin-btn admin-btn-sm admin-btn-primary" style={{ marginTop: 12 }}>
                <Plus size={14} />
                <span>Create Post</span>
              </Link>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title & URL</th>
                    <th>Category</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((post) => (
                    <tr key={post._id}>
                      <td>
                        <strong style={{ color: "#0f172a", fontSize: 13 }}>{post.title}</strong>
                        <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>/blog/{post.slug}</div>
                      </td>
                      <td>
                        <span className="admin-badge-soft">{post.category || "General"}</span>
                      </td>
                      <td>
                        <StatusBadge status={post.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Audit Activity Log Feed */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="admin-card-icon-tag">
                <Activity size={16} />
              </div>
              <div>
                <h2 className="admin-card-title">Audit Activity Feed</h2>
                <span className="admin-card-caption">Real-time system action logging</span>
              </div>
            </div>
            <span className="admin-live-badge">
              <span className="admin-live-dot"></span>
              Live Feed
            </span>
          </div>

          {activityLogs.length === 0 ? (
            <div className="admin-empty-box">
              <Activity size={32} className="admin-empty-icon" />
              <p className="admin-empty-title">No activity logged yet</p>
              <p className="admin-empty-text">Administrative actions, edits, and logins will be tracked here in real time.</p>
            </div>
          ) : (
            <div className="admin-activity-stream">
              {activityLogs.map((log) => (
                <div key={log._id} className="admin-activity-item">
                  <div className="admin-activity-dot-line">
                    <span className="admin-activity-dot"></span>
                  </div>
                  <div className="admin-activity-content">
                    <div className="admin-activity-head">
                      <strong className="admin-activity-user">{log.userName || "System"}</strong>
                      <span className="admin-activity-action">{log.action ? log.action.replace(/_/g, " ") : "performed action"}</span>
                    </div>
                    {log.details && (
                      <div className="admin-activity-details">{log.details}</div>
                    )}
                    <div className="admin-activity-time">
                      <Clock size={11} />
                      <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                    </div>
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
