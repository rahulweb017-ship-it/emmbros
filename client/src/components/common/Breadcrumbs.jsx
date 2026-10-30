import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SEO_PAGES, normalizeCanonicalPath } from "../../config/seoConfig";

export function Breadcrumbs({ items }) {
  const location = useLocation();
  const normPath = normalizeCanonicalPath(location.pathname);
  const crumbs = items || SEO_PAGES[normPath]?.breadcrumbs || [];

  if (!crumbs || crumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="emmbros-breadcrumbs"
      style={{
        background: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
        padding: "10px 20px",
        fontSize: "14px",
        fontFamily: '"Basic", Sans-serif',
      }}
    >
      <ol
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
          color: "#475569",
        }}
      >
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <li key={crumb.path || idx} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {idx > 0 && <span aria-hidden="true" style={{ color: "#94a3b8" }}>/</span>}
              {isLast ? (
                <span aria-current="page" style={{ color: "#034464", fontWeight: 600 }}>
                  {crumb.name}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  style={{ color: "#334155", textDecoration: "none", fontWeight: 500 }}
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
