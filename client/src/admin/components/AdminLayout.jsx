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

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
    { label: "Blog Posts", path: "/admin/posts", icon: FileText },
    { label: "Job Postings", path: "/admin/jobs", icon: Briefcase },
    { label: "Pages & SEO", path: "/admin/pages", icon: FileCode },
    { label: "301 Redirects", path: "/admin/redirects", icon: ArrowRightLeft },
    { label: "Media Library", path: "/admin/media", icon: ImageIcon },
  ];

  // Admin-only items
  if (user?.role === "admin") {
    navItems.push({ label: "User Accounts", path: "/admin/users", icon: UsersIcon });
    navItems.push({ label: "Site Settings", path: "/admin/settings", icon: Settings });
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
            <span className="admin-brand-logo">Emmbros</span>
            <span className="admin-brand-badge">CMS</span>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-view-site-link"
          >
            <span>View Website</span>
            <ExternalLink size={13} />
          </a>
        </div>

        <div className="admin-topbar-right">
          {user && (
            <div className="admin-user-profile">
              <span className="admin-avatar">
                <UserIcon size={14} />
              </span>
              <span className="admin-username">{user.name || user.email}</span>
              <span className="admin-user-role">{user.role}</span>
            </div>
          )}
          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
            title="Log out"
          >
            <LogOut size={16} />
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

        {/* WordPress-style Left Sidebar */}
        <aside className={`admin-sidebar ${mobileOpen ? "open" : ""}`}>
          <div className="admin-sidebar-header">
            <span className="admin-sidebar-title">NAVIGATION</span>
          </div>
          <nav className="admin-sidebar-nav">
            {navItems.map((item) => {
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
          <div className="admin-sidebar-footer">
            <p>Emmbros Autocomp v1.0</p>
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
