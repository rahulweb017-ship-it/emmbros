import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function MobileMenu({ isOpen, onClose }) {
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const location = useLocation();

  if (!isOpen) return null;

  const toggleAccordion = (name) => {
    setMobileAccordion((prev) => (prev === name ? null : name));
  };

  return (
    <div
      className="mobile-nav-drawer"
      style={{
        background: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        boxShadow: "0 12px 28px rgba(0, 0, 0, 0.12)",
        padding: "8px 20px 18px",
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Basic", Sans-serif',
        maxHeight: "calc(100vh - 65px)",
        overflowY: "auto",
      }}
    >
      {/* Who We Are Accordion */}
      <div style={{ borderBottom: "1px solid #f1f5f9" }}>
        <div
          onClick={() => toggleAccordion("whoweare")}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            fontWeight: 500,
            fontSize: "16px",
            cursor: "pointer",
            color: location.pathname.startsWith("/who-we-are") ? "#034464" : "#242424",
          }}
        >
          <Link
            to="/who-we-are"
            onClick={onClose}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Who We Are
          </Link>
          <span
            onClick={(e) => {
              e.stopPropagation();
              toggleAccordion("whoweare");
            }}
            role="button"
            tabIndex={0}
            aria-label="Toggle Who We Are submenu"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px 8px",
              fontSize: "14px",
              lineHeight: 1,
              color: "#242424",
              userSelect: "none",
              transform: mobileAccordion === "whoweare" ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          >
            ▾
          </span>
        </div>
        {mobileAccordion === "whoweare" && (
          <div
            style={{
              padding: "4px 0 12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              borderLeft: "2px solid #034464",
              marginLeft: 4,
              marginBottom: 8,
            }}
          >
            <Link to="/who-we-are#about" onClick={onClose} style={{ color: "#333", textDecoration: "none", fontSize: "15px" }}>🏢 About us</Link>
            <Link to="/who-we-are#leadership" onClick={onClose} style={{ color: "#333", textDecoration: "none", fontSize: "15px" }}>👨 Leadership</Link>
            <Link to="/who-we-are#ourjourney" onClick={onClose} style={{ color: "#333", textDecoration: "none", fontSize: "15px" }}>📈 Our Journey</Link>
            <Link to="/who-we-are#futureplan" onClick={onClose} style={{ color: "#333", textDecoration: "none", fontSize: "15px" }}>🚀 Future Plan</Link>
            <Link to="/quality-certifications" onClick={onClose} style={{ color: "#333", textDecoration: "none", fontSize: "15px" }}>🧾 Certification</Link>
          </div>
        )}
      </div>

      {/* What We Do Accordion */}
      <div style={{ borderBottom: "1px solid #f1f5f9" }}>
        <div
          onClick={() => toggleAccordion("whatwedo")}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            fontWeight: 500,
            fontSize: "16px",
            cursor: "pointer",
            color: location.pathname.startsWith("/what-we-do") ? "#034464" : "#242424",
          }}
        >
          <Link
            to="/what-we-do"
            onClick={onClose}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            What We Do
          </Link>
          <span
            onClick={(e) => {
              e.stopPropagation();
              toggleAccordion("whatwedo");
            }}
            role="button"
            tabIndex={0}
            aria-label="Toggle What We Do submenu"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px 8px",
              fontSize: "14px",
              lineHeight: 1,
              color: "#242424",
              userSelect: "none",
              transform: mobileAccordion === "whatwedo" ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          >
            ▾
          </span>
        </div>
        {mobileAccordion === "whatwedo" && (
          <div
            style={{
              padding: "4px 0 12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              borderLeft: "2px solid #034464",
              marginLeft: 4,
              marginBottom: 8,
            }}
          >
            <Link to="/what-we-do#forging" onClick={onClose} style={{ color: "#333", textDecoration: "none", fontSize: "15px" }}>🔧 Forging Solutions</Link>
            <Link to="/what-we-do#heattreatment" onClick={onClose} style={{ color: "#333", textDecoration: "none", fontSize: "15px" }}>🔥 Heat Treatment Technology</Link>
            <Link to="/what-we-do#manufacturing" onClick={onClose} style={{ color: "#333", textDecoration: "none", fontSize: "15px" }}>⚙️ Precision Machining</Link>
            <Link to="/quality-certifications" onClick={onClose} style={{ color: "#333", textDecoration: "none", fontSize: "15px" }}>🧪 Quality &amp; Testing</Link>
            <Link to="/what-we-do#research" onClick={onClose} style={{ color: "#333", textDecoration: "none", fontSize: "15px" }}>💡 Research &amp; Development</Link>
            <Link to="/what-we-do#csr-activity" onClick={onClose} style={{ color: "#333", textDecoration: "none", fontSize: "15px" }}>🌱 CSR Activity</Link>
          </div>
        )}
      </div>

      {/* Product Application Accordion */}
      <div style={{ borderBottom: "1px solid #f1f5f9" }}>
        <div
          onClick={() => toggleAccordion("products")}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            fontWeight: 500,
            fontSize: "16px",
            cursor: "pointer",
            color: location.pathname.startsWith("/product-application") ? "#034464" : "#242424",
          }}
        >
          <Link
            to="/product-application"
            onClick={onClose}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Product Application
          </Link>
          <span
            onClick={(e) => {
              e.stopPropagation();
              toggleAccordion("products");
            }}
            role="button"
            tabIndex={0}
            aria-label="Toggle Product Application submenu"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px 8px",
              fontSize: "14px",
              lineHeight: 1,
              color: "#242424",
              userSelect: "none",
              transform: mobileAccordion === "products" ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          >
            ▾
          </span>
        </div>
        {mobileAccordion === "products" && (
          <div
            style={{
              padding: "4px 0 12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              borderLeft: "2px solid #034464",
              marginLeft: 4,
              marginBottom: 8,
            }}
          >
            <Link to="/product-application/front-axle-shaft" onClick={onClose} style={{ color: "#333", textDecoration: "none", fontSize: "15px" }}>Front Axle Parts</Link>
            <Link to="/product-application/rear-axle-shaft" onClick={onClose} style={{ color: "#333", textDecoration: "none", fontSize: "15px" }}>Rear Axle Parts</Link>
            <Link to="/product-application/gear-box-parts" onClick={onClose} style={{ color: "#333", textDecoration: "none", fontSize: "15px" }}>Gear Box Parts</Link>
            <Link to="/product-application/driveline-parts" onClick={onClose} style={{ color: "#333", textDecoration: "none", fontSize: "15px" }}>Driveline Parts</Link>
            <Link to="/product-application/hydraulic-parts" onClick={onClose} style={{ color: "#333", textDecoration: "none", fontSize: "15px" }}>Hydraulic Parts</Link>
            <Link to="/product-application/planetary-wheel-drive-parts" onClick={onClose} style={{ color: "#333", textDecoration: "none", fontSize: "15px" }}>Planetary Wheel Drive Parts</Link>
          </div>
        )}
      </div>

      {/* Career */}
      <Link
        to="/career"
        onClick={onClose}
        style={{
          padding: "12px 0",
          fontWeight: 500,
          fontSize: "16px",
          color: location.pathname === "/career" || location.pathname === "/career/" ? "#034464" : "#242424",
          textDecoration: "none",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        Career
      </Link>

      {/* Emmpower Link with Logo */}
      <a
        href="https://emmpower.in/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        style={{
          padding: "12px 0 4px",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          fontWeight: 500,
          fontSize: "16px",
          color: "#242424",
          textDecoration: "none",
        }}
      >
        <img
          src="/assets/images/logo-1.webp"
          alt="Emmpower Automotive Spares by Emmbros"
          width="120"
          height="38"
          loading="lazy"
          style={{ maxHeight: 34, width: "auto", objectFit: "contain" }}
        />
      </a>
    </div>
  );
}
