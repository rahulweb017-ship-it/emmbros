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

  // Handle navigation + form messages coming from inside the mirrored page iframe.
  useEffect(() => {
    function onMessage(e) {
      const d = e.data;
      if (!d || !d.__emmbros) return;
      if (d.type === "navigate" && d.path) {
        navigate(d.path);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [navigate]);

  // Keep document title in sync.
  useEffect(() => {
    if (route?.title) document.title = route.title;
  }, [route]);

  // After the frame loads, if the URL has a hash, ask the page to scroll to it.
  function onFrameLoad() {
    setLoading(false);
    const hash = location.hash ? location.hash.slice(1) : "";
    if (hash && frameRef.current?.contentWindow) {
      frameRef.current.contentWindow.postMessage(
        { __emmbros_parent: true, type: "scroll", hash },
        "*"
      );
    }
  }

  return (
    <div className="page-transition-wrapper">
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
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
