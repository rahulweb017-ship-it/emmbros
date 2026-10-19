import React from "react";
import { Link } from "react-router-dom";
import { PageMeta } from "../components/common/PageMeta";

export function NotFound() {
  return (
    <div style={{ maxWidth: 640, margin: "80px auto", textAlign: "center", padding: "0 20px" }}>
      <PageMeta
        title="404 - Page Not Found | Emmbros Autocomp Ltd"
        description="The requested page could not be found on Emmbros Autocomp Ltd."
        canonicalUrl="/404"
      />
      <h1 style={{ fontSize: 56, fontWeight: 800, color: "#002c40", marginBottom: 16 }}>404</h1>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Page Not Found</h2>
      <p style={{ color: "#4b5563", fontSize: 16, marginBottom: 28, lineHeight: 1.6 }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        style={{
          display: "inline-block",
          background: "#002c40",
          color: "#ffffff",
          textDecoration: "none",
          padding: "12px 28px",
          borderRadius: 4,
          fontWeight: 600
        }}
      >
        Return to Homepage
      </Link>
    </div>
  );
}
