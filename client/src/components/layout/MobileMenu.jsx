import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Phone } from "lucide-react";

export function MobileMenu({ isOpen, onClose }) {
  const [mobileAccordion, setMobileAccordion] = useState(null);

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
        padding: "16px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Who We Are Accordion */}
      <div>
        <div
          onClick={() => toggleAccordion("whoweare")}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            fontWeight: 600,
            cursor: "pointer",
            color: "#1e293b",
          }}
        >
          <Link
            to="/who-we-are"
            onClick={onClose}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Who We Are
          </Link>
          <ChevronDown size={18} />
        </div>
        {mobileAccordion === "whoweare" && (
          <div style={{ paddingLeft: 16, display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
            <Link to="/who-we-are/#about" onClick={onClose} style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>About us</Link>
            <Link to="/who-we-are/#leadership" onClick={onClose} style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>Leadership</Link>
            <Link to="/who-we-are/#ourjourney" onClick={onClose} style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>Our Journey</Link>
            <Link to="/who-we-are/#futureplan" onClick={onClose} style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>Future Plan</Link>
            <Link to="/who-we-are/#certification" onClick={onClose} style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>Certification</Link>
          </div>
        )}
      </div>

      {/* What We Do Accordion */}
      <div>
        <div
          onClick={() => toggleAccordion("whatwedo")}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            fontWeight: 600,
            cursor: "pointer",
            color: "#1e293b",
          }}
        >
          <Link
            to="/what-we-do"
            onClick={onClose}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            What We Do
          </Link>
          <ChevronDown size={18} />
        </div>
        {mobileAccordion === "whatwedo" && (
          <div style={{ paddingLeft: 16, display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
            <Link to="/what-we-do/#forging" onClick={onClose} style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>Forging Solutions</Link>
            <Link to="/what-we-do/#heattreatment" onClick={onClose} style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>Heat Treatment Technology</Link>
            <Link to="/what-we-do/#manufacturing" onClick={onClose} style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>Precision Machining</Link>
            <Link to="/what-we-do/#qualitylab" onClick={onClose} style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>Quality &amp; Testing</Link>
            <Link to="/what-we-do/#research" onClick={onClose} style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>Research &amp; Development</Link>
            <Link to="/what-we-do/#csr-activity" onClick={onClose} style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>CSR Activity</Link>
          </div>
        )}
      </div>

      {/* Product Application Accordion */}
      <div>
        <div
          onClick={() => toggleAccordion("products")}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            fontWeight: 600,
            cursor: "pointer",
            color: "#1e293b",
          }}
        >
          <Link
            to="/product-application"
            onClick={onClose}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Product Application
          </Link>
          <ChevronDown size={18} />
        </div>
        {mobileAccordion === "products" && (
          <div style={{ paddingLeft: 16, display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
            <Link to="/product-application/front-axle-shaft" onClick={onClose} style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>Front Axle Parts</Link>
            <Link to="/product-application/rear-axle-shaft" onClick={onClose} style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>Rear Axle Parts</Link>
            <Link to="/product-application/gear-box-parts" onClick={onClose} style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>Gear Box Parts</Link>
            <Link to="/product-application/driveline-parts" onClick={onClose} style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>Driveline Parts</Link>
            <Link to="/product-application/hydraulic-parts" onClick={onClose} style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>Hydraulic Parts</Link>
            <Link to="/product-application/planetary-wheel-drive-parts" onClick={onClose} style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>Planetary Wheel Drive Parts</Link>
          </div>
        )}
      </div>

      <Link
        to="/career"
        onClick={onClose}
        style={{ padding: "10px 0", fontWeight: 600, color: "#1e293b", textDecoration: "none" }}
      >
        Career
      </Link>
      <Link
        to="/blog"
        onClick={onClose}
        style={{ padding: "10px 0", fontWeight: 600, color: "#1e293b", textDecoration: "none" }}
      >
        Blog
      </Link>

      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16, marginTop: 8, display: "flex", flexDirection: "column", gap: 10, fontSize: "14px" }}>
        <a href="tel:+919816931822" style={{ display: "flex", alignItems: "center", gap: 8, color: "#002c40", textDecoration: "none" }}>
          <Phone size={16} />
          <span>+91-98169-31822</span>
        </a>
        <a href="https://api.whatsapp.com/send/?phone=919816931822" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, color: "#25D366", textDecoration: "none" }}>
          <span>WhatsApp Chat</span>
        </a>
      </div>
    </div>
  );
}
