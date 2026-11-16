import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  FileCode,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User as UserIcon,
  Users as UsersIcon,
  ArrowRightLeft,
  ClipboardList,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.info("Logged out of admin panel.");
    navigate("/admin/login");
  };

  const navSections = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
      ],
    },
    {
      title: "Content Management",
      items: [
        { label: "Blog Posts", path: "/admin/posts", icon: FileText },
        { label: "Job Postings", path: "/admin/jobs", icon: Briefcase },
        { label: "Job Applications", path: "/admin/applications", icon: ClipboardList },
      ],
    },
    {
      title: "SEO & Media",
      items: [
        { label: "Pages & SEO", path: "/admin/pages", icon: FileCode },
        { label: "301 Redirects", path: "/admin/redirects", icon: ArrowRightLeft },
        { label: "Media Library", path: "/admin/media", icon: ImageIcon },
      ],
    },
  ];

  if (user?.role === "admin") {
    navSections.push({
      title: "Administration",
      items: [
        { label: "User Accounts", path: "/admin/users", icon: UsersIcon },
        { label: "Site Settings", path: "/admin/settings", icon: Settings },
      ],
    });
  }

  return (
    <div className="admin-app-layout">
      {/* Top Header Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <button
            type="button"
            className="admin-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="admin-brand">
            <span className="admin-brand-icon">
              <Sparkles size={16} />
            </span>
            <span className="admin-brand-logo">Emmbros</span>
            <span className="admin-brand-badge">CMS</span>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-view-site-link"
          >
            <span>Live Website</span>
            <ExternalLink size={13} />
          </a>
        </div>

        <div className="admin-topbar-right">
          {user && (
            <div className="admin-user-profile">
              <span className="admin-avatar">
                <UserIcon size={14} />
              </span>
              <div className="admin-user-details">
                <span className="admin-username">{user.name || user.email}</span>
                <span className="admin-user-role-badge">
                  <ShieldCheck size={11} />
                  {user.role}
                </span>
              </div>
            </div>
          )}
          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
            title="Log out of admin session"
          >
            <LogOut size={15} />
            <span className="admin-logout-text">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="admin-body-container">
        {/* Mobile Backdrop */}
        {mobileOpen && (
          <div className="admin-sidebar-backdrop" onClick={() => setMobileOpen(false)} />
        )}

        {/* Modern SaaS-Style Left Sidebar */}
        <aside className={`admin-sidebar ${mobileOpen ? "open" : ""}`}>
          <div className="admin-sidebar-scroll">
            {navSections.map((sec, idx) => (
              <div key={idx} className="admin-sidebar-section">
                <div className="admin-sidebar-heading">{sec.title}</div>
                <nav className="admin-sidebar-nav">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                          `admin-nav-item ${isActive ? "active" : ""}`
                        }
                        onClick={() => setMobileOpen(false)}
                      >
                        <Icon size={18} className="admin-nav-icon" />
                        <span className="admin-nav-label">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          <div className="admin-sidebar-footer">
            <div className="admin-system-status">
              <span className="admin-status-dot"></span>
              <span>System Online (v1.2)</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main-content">
          <div className="admin-page-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
