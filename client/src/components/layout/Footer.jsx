import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="emmbros-site-footer" style={{ background: "#ffffff", borderTop: "1px solid #e9e9e9", color: "#333333" }}>
      {/* Main 3-Column Footer Section */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "45px 20px 35px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 30 }}>
        {/* Col 1: Logo & Company Description & Socials */}
        <div style={{ flex: "1 1 300px", maxWidth: 360 }}>
          <Link to="/" style={{ display: "inline-block", marginBottom: 16 }}>
            <img
              src="/assets/images/logo1.webp"
              alt="Emmbros Autocomp Ltd Logo"
              width="240"
              height="56"
              loading="lazy"
              style={{ maxHeight: 52, width: "auto", objectFit: "contain" }}
            />
          </Link>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#555555", margin: "0 0 20px" }}>
            Emmbros Autocomp Ltd. – Engineering Products to Perfection.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a
              href="https://www.facebook.com/emmbrosautocompltd"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid #585858",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#585858",
                textDecoration: "none",
                fontSize: 14,
                transition: "all 0.2s ease"
              }}
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>

            <a
              href="https://www.linkedin.com/in/emmbros-autocomp-limited-83724a94/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid #585858",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#585858",
                textDecoration: "none",
                fontSize: 14,
                transition: "all 0.2s ease"
              }}
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>

            <a
              href="https://www.instagram.com/emmbrosautocomp1/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid #585858",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#585858",
                textDecoration: "none",
                fontSize: 14,
                transition: "all 0.2s ease"
              }}
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>

            <a
              href="https://www.youtube.com/watch?v=LwSK2Yxii4c&feature=youtu.be"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid #585858",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#585858",
                textDecoration: "none",
                fontSize: 14,
                transition: "all 0.2s ease"
              }}
              aria-label="YouTube"
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Col 2: Regd & Works */}
        <div style={{ flex: "1 1 280px", maxWidth: 350 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
            <img
              src="/assets/images/icon.webp"
              alt="Emmbros Autocomp Registered and Works Baddi Address Icon"
              width="47"
              height="49"
              loading="lazy"
              style={{ width: 42, height: "auto", flexShrink: 0 }}
            />
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: 700, color: "#111827", fontFamily: '"Basic", Sans-serif' }}>
                Regd &amp; Works
              </h2>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", color: "#555555" }}>
                Village Katha, Baddi , Distt. Solan. 173205 (HP) India.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 56 }}>
            <a
              href="mailto:reception@emmbros.com"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#333333", textDecoration: "none", fontSize: "14px" }}
            >
              <i className="fas fa-envelope" style={{ color: "#034464", fontSize: "14px" }}></i>
              <span>reception@emmbros.com</span>
            </a>

            <a
              href="tel:+917807772004"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#333333", textDecoration: "none", fontSize: "14px" }}
            >
              <i className="icon_phone" style={{ color: "#034464", fontSize: "15px" }}></i>
              <span>+91-78077-72004</span>
            </a>
          </div>
        </div>

        {/* Col 3: Corp & Works */}
        <div style={{ flex: "1 1 280px", maxWidth: 350 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
            <img
              src="/assets/images/new-project-54.webp"
              alt="Emmbros Autocomp Corporate and Works Baddi Address Icon"
              width="47"
              height="49"
              loading="lazy"
              style={{ width: 42, height: "auto", flexShrink: 0 }}
            />
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: 700, color: "#111827", fontFamily: '"Basic", Sans-serif' }}>
                Corp &amp; Works
              </h2>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", color: "#555555" }}>
                Village Bhud, Baddi, Distt.Solan. 173205 (HP) India.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 56 }}>
            <a
              href="mailto:enquiry@emmbros.com"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#333333", textDecoration: "none", fontSize: "14px" }}
            >
              <i className="fas fa-envelope" style={{ color: "#034464", fontSize: "14px" }}></i>
              <span>enquiry@emmbros.com</span>
            </a>

            <a
              href="tel:+91-78078-80990"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#333333", textDecoration: "none", fontSize: "14px" }}
            >
              <i className="icon_phone" style={{ color: "#034464", fontSize: "15px" }}></i>
              <span>+91-78078-80990</span>
            </a>
          </div>
        </div>
      </div>

      {/* Crawlable Internal Navigation Links Strip */}
      <nav
        aria-label="Footer Navigation"
        style={{
          borderTop: "1px solid #f1f5f9",
          padding: "18px 20px",
          background: "#f8fafc",
          fontSize: "13px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px 18px",
          }}
        >
          <Link to="/" style={{ color: "#334155", textDecoration: "none" }}>Home</Link>
          <Link to="/who-we-are" style={{ color: "#334155", textDecoration: "none" }}>About Emmbros</Link>
          <Link to="/what-we-do" style={{ color: "#334155", textDecoration: "none" }}>Forging &amp; Machining</Link>
          <Link to="/quality-certifications" style={{ color: "#334155", textDecoration: "none" }}>Quality &amp; Certifications</Link>
          <Link to="/industries-clients" style={{ color: "#334155", textDecoration: "none" }}>Industries &amp; OEM Clients</Link>
          <Link to="/product-application" style={{ color: "#334155", textDecoration: "none" }}>Product Applications</Link>
          <Link to="/product-application/rear-axle-shaft" style={{ color: "#334155", textDecoration: "none" }}>Rear Axle Shafts</Link>
          <Link to="/product-application/front-axle-shaft" style={{ color: "#334155", textDecoration: "none" }}>Front Axle Shafts</Link>
          <Link to="/product-application/driveline-parts" style={{ color: "#334155", textDecoration: "none" }}>Driveline Parts</Link>
          <Link to="/product-application/gear-box-parts" style={{ color: "#334155", textDecoration: "none" }}>Gearbox Parts</Link>
          <Link to="/product-application/hydraulic-parts" style={{ color: "#334155", textDecoration: "none" }}>Hydraulic Parts</Link>
          <Link to="/product-application/planetary-wheel-drive-parts" style={{ color: "#334155", textDecoration: "none" }}>Planetary Wheel Drive Parts</Link>
          <Link to="/career" style={{ color: "#334155", textDecoration: "none" }}>Career</Link>
          <Link to="/careers" style={{ color: "#334155", textDecoration: "none" }}>Open Positions</Link>
          <Link to="/blog" style={{ color: "#334155", textDecoration: "none" }}>Engineering Blog</Link>
          <Link to="/contact" style={{ color: "#334155", textDecoration: "none" }}>Contact Us</Link>
        </div>
      </nav>

      {/* Bottom Copyright Strip */}
      <div style={{ borderTop: "1px solid #e9e9e9", padding: "16px 20px", textAlign: "center", fontSize: "14px", color: "#777777" }}>
        Copyright © 2026 Emmbros Autocomp Ltd. All rights reserved.
      </div>
    </footer>
  );
}
