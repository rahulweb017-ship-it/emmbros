import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { matchRoute } from "./routes.js";

export default function App() {
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
    <div className="page-transition-wrapper">
      {loading && (
        <div className="loading-spinner">
          <img
            src="/wp-content/uploads/2025/12/logo1.png"
            alt="Emmbros Autocomp Ltd"
            className="logo-bounce"
          />
        </div>
      )}
      <iframe
        key={route.slug}
        ref={frameRef}
        className={`emmbros-frame ${loading ? '' : 'frame-loaded'}`}
        src={`/pages/${route.slug}.html`}
        title={route.title}
        onLoad={onFrameLoad}
      />
    </div>
  );
}

