import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { matchRoute } from "./routes.js";
import { LoadingSpinner } from "./admin/components/LoadingSpinner";

import { BlogListPage } from "./public/pages/BlogListPage";
import { BlogPostPage } from "./public/pages/BlogPostPage";
import { CareersListPage } from "./public/pages/CareersListPage";
import { JobDetailPage } from "./public/pages/JobDetailPage";

// Lazy load Admin module to keep public website bundle minimal
const AdminApp = lazy(() => import("./admin/AdminApp"));

function PublicSiteWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const frameRef = useRef(null);
  const route = matchRoute(location.pathname);

  const [loading, setLoading] = useState(true);

  // Reset loading state when route changes
  useEffect(() => {
    setLoading(true);
  }, [route.slug]);

  // Handle navigation + hash updates from inside the iframe.
  useEffect(() => {
    function onMessage(e) {
      const d = e.data;
      if (!d || !d.__emmbros) return;
      if (d.type === "navigate" && d.path) {
        navigate(d.path);
      } else if (d.type === "updateHash") {
        const hashStr = d.hash ? `#${d.hash}` : "";
        if (window.location.hash !== hashStr) {
          window.history.replaceState(null, "", location.pathname + hashStr);
        }
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [navigate, location.pathname]);

  // Keep document title in sync.
  useEffect(() => {
    if (route?.title) document.title = route.title;
  }, [route]);

  // Post scroll message when hash/pathname/loading changes.
  useEffect(() => {
    if (!loading && frameRef.current?.contentWindow) {
      const hash = location.hash ? location.hash.slice(1) : "";
      frameRef.current.contentWindow.postMessage(
        { __emmbros_parent: true, type: "scroll", hash },
        "*"
      );
    }
  }, [location.hash, location.pathname, loading]);

  function onFrameLoad() {
    setLoading(false);
    const hash = location.hash ? location.hash.slice(1) : "";
    if (hash && frameRef.current?.contentWindow) {
      setTimeout(() => {
        frameRef.current?.contentWindow?.postMessage(
          { __emmbros_parent: true, type: "scroll", hash },
          "*"
        );
      }, 300);
    }
  }

  return (
    <main id="main-content" className="page-transition-wrapper" role="main">
      {loading && (
        <div className="loading-spinner">
          <img
            src="/wp-content/uploads/2025/12/logo1.webp"
            alt="Emmbros Autocomp Ltd"
            className="logo-bounce"
            width="200"
            height="47"
            fetchpriority="high"
          />
        </div>
      )}
      <iframe
        key={route.slug}
        ref={frameRef}
        className={`emmbros-frame ${loading ? "" : "frame-loaded"}`}
        src={`/pages/${route.slug}.html`}
        title={route.title}
        onLoad={onFrameLoad}
      />
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      {/* CMS Public React Views */}
      <Route path="/blog" element={<BlogListPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/careers" element={<CareersListPage />} />
      <Route path="/careers/:slug" element={<JobDetailPage />} />

      {/* Lazy Loaded Admin Module under /admin/* */}
      <Route
        path="/admin/*"
        element={
          <Suspense
            fallback={
              <div className="admin-page-loading">
                <LoadingSpinner message="Loading Admin Panel..." size="large" />
              </div>
            }
          >
            <AdminApp />
          </Suspense>
        }
      />

      {/* Public Site Mirrored Pages Wrapper */}
      <Route path="*" element={<PublicSiteWrapper />} />
    </Routes>
  );
}
