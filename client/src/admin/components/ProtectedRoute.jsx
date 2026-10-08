import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "./LoadingSpinner";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Enforce noindex, nofollow meta tag for all admin pages
  useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]');
    let created = false;

    if (!metaRobots) {
      metaRobots = document.createElement("meta");
      metaRobots.setAttribute("name", "robots");
      document.head.appendChild(metaRobots);
      created = true;
    }

    const prevContent = metaRobots.getAttribute("content");
    metaRobots.setAttribute("content", "noindex, nofollow");

    return () => {
      if (created && metaRobots.parentNode) {
        metaRobots.parentNode.removeChild(metaRobots);
      } else if (prevContent) {
        metaRobots.setAttribute("content", prevContent);
      } else {
        metaRobots.removeAttribute("content");
      }
    };
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="admin-page-loading">
        <LoadingSpinner message="Verifying admin session..." size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
