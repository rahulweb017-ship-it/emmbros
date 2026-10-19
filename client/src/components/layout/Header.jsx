import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  return (
    <header className="emmbros-site-header" style={{ position: "sticky", top: 0, zIndex: 1000, background: "#ffffff", borderBottom: "1px solid #e9e9e9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 90 }}>
        {/* Left: Full Height Emmbros Brand Logo */}
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
          <img
            src="/assets/images/logo1.webp"
            alt="Emmbros Autocomp Ltd Logo"
            width="280"
            height="66"
            style={{ maxHeight: 65, width: "auto", objectFit: "contain" }}
          />
        </Link>

        {/* Right: Desktop 2-Tier Layout (Top Info Strip + Main Nav) */}
        <div className="header-right-col" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flex: 1, marginLeft: 30 }}>
          {/* Tier 1: Top Contact Bar */}
          <div className="header-top-tier" style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #e9e9e9", paddingBottom: 6, marginBottom: 8, fontSize: "14px" }}>
            {/* Chat WhatsApp Link */}
            <a
              href="https://api.whatsapp.com/send/?phone=919816931822&text=How+can+i+help+you%3F&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#111827", textDecoration: "none", fontWeight: 500, paddingRight: 16 }}
            >
              <svg className="ekit-svg-icon icon-message-1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ width: 16, height: 16, fill: "currentColor" }}>
                <path d="M31.976 12.75c-0-0.048-0.011-0.121-0.029-0.163-0.049-0.178-0.159-0.341-0.322-0.455l-4.581-3.184v-3.413c0-0.452-0.367-0.819-0.82-0.819h-5.27l-4.484-3.117c-0.28-0.195-0.652-0.196-0.933-0.002l-4.513 3.119h-5.247c-0.453 0-0.819 0.367-0.819 0.819v3.373l-4.603 3.181c-0.226 0.156-0.349 0.407-0.353 0.662-0 0.005-0.001 0.009-0.001 0.014l0.024 17.765c0 0.217 0.087 0.426 0.241 0.579s0.362 0.239 0.579 0.239c0 0 0.001 0 0.001 0l30.337-0.042c0.453-0.001 0.819-0.368 0.818-0.821l-0.024-17.737zM27.043 10.944l2.619 1.82-2.619 1.82v-3.64zM16.001 3.268l2.082 1.447h-4.176l2.094-1.447zM6.596 6.354h18.808v9.37l-6.315 4.39-2.575-1.997c-0.004-0.003-0.007-0.005-0.011-0.008-0.288-0.216-0.695-0.224-0.993 0.008l-2.593 2.012-6.321-4.368v-9.406zM4.957 10.9v3.728l-2.697-1.864 2.697-1.864zM1.641 14.329l9.917 6.853-9.897 7.677-0.020-14.53zM3.242 29.707l12.77-9.905 12.724 9.87-25.495 0.035zM20.447 21.167l9.892-6.877 0.020 14.566-9.912-7.689zM21.548 9.632h-11.096c-0.453 0-0.819 0.367-0.819 0.819s0.367 0.819 0.819 0.819h11.096c0.453 0 0.82-0.367 0.82-0.819s-0.367-0.819-0.82-0.819zM21.548 13.893h-11.096c-0.453 0-0.819 0.367-0.819 0.819s0.367 0.819 0.819 0.819h11.096c0.453 0 0.82-0.367 0.82-0.819s-0.367-0.819-0.82-0.819z"></path>
              </svg>
              <span>Chat</span>
            </a>

            <span style={{ height: 18, width: 1, background: "#e9e9e9", marginRight: 16 }}></span>

            {/* Phone Link */}
            <a
              href="tel:+919816931822"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#111827", textDecoration: "none", fontWeight: 500, paddingRight: 16 }}
            >
              <i className="icon_phone" style={{ fontSize: "15px" }}></i>
              <span>+91-98169-31822</span>
            </a>

            <span style={{ height: 18, width: 1, background: "#e9e9e9", marginRight: 16 }}></span>

            {/* Social Media Outlined Square Icons */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 16 }}>
              <a
                href="https://www.facebook.com/emmbrosautocompltd"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  border: "1px solid #c7c7c7",
                  borderRadius: 4,
                  color: "#333333",
                  textDecoration: "none",
                  fontSize: 13
                }}
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>

              <a
                href="https://www.instagram.com/emmbrosautocomp1/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  border: "1px solid #c7c7c7",
                  borderRadius: 4,
                  color: "#333333",
                  textDecoration: "none",
                  fontSize: 13
                }}
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>

              <a
                href="https://www.linkedin.com/in/emmbros-autocomp-limited-83724a94/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  border: "1px solid #c7c7c7",
                  borderRadius: 4,
                  color: "#333333",
                  textDecoration: "none",
                  fontSize: 13
                }}
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>

            <span style={{ height: 18, width: 1, background: "#e9e9e9", marginRight: 16 }}></span>

            {/* Emmpower Logo */}
            <a
              href="https://emmpower.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <img
                src="/assets/images/logo-1.webp"
                alt="Emmpower Automotive Spares by Emmbros"
                width="135"
                height="42"
                style={{ maxHeight: 38, width: "auto", objectFit: "contain" }}
              />
            </a>
          </div>

          {/* Tier 2: Navigation Links Bar */}
          <div className="header-nav-tier" style={{ display: "flex", alignItems: "center" }}>
            <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 30 }}>
              {/* Who We Are */}
              <div
                className="nav-dropdown-item"
                style={{ position: "relative" }}
                onMouseEnter={() => setActiveDropdown("whoweare")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to="/who-we-are/"
                  style={{
                    color: location.pathname.startsWith("/who-we-are") ? "#034464" : "#242424",
                    fontFamily: '"Basic", Sans-serif',
                    fontSize: "16px",
                    fontWeight: 500,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 0"
                  }}
                >
                  <span>Who We Are</span>
                  <ChevronDown size={14} />
                </Link>

                {activeDropdown === "whoweare" && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      minWidth: 240,
                      background: "#ffffff",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                      border: "1px solid #ebebeb",
                      borderRadius: 4,
                      padding: "10px 0",
                      zIndex: 1001,
                    }}
                  >
                    <Link to="/who-we-are/#about" style={{ display: "block", padding: "10px 18px", color: "#333", textDecoration: "none", fontSize: "15px", fontFamily: '"Basic", Sans-serif' }}>🏢 About us</Link>
                    <Link to="/who-we-are/#leadership" style={{ display: "block", padding: "10px 18px", color: "#333", textDecoration: "none", fontSize: "15px", fontFamily: '"Basic", Sans-serif' }}>👨 Leadership</Link>
                    <Link to="/who-we-are/#ourjourney" style={{ display: "block", padding: "10px 18px", color: "#333", textDecoration: "none", fontSize: "15px", fontFamily: '"Basic", Sans-serif' }}>📈 Our Journey</Link>
                    <Link to="/who-we-are/#futureplan" style={{ display: "block", padding: "10px 18px", color: "#333", textDecoration: "none", fontSize: "15px", fontFamily: '"Basic", Sans-serif' }}>🚀 Future Plan</Link>
                    <Link to="/who-we-are/#certification" style={{ display: "block", padding: "10px 18px", color: "#333", textDecoration: "none", fontSize: "15px", fontFamily: '"Basic", Sans-serif' }}>🧾 Certification</Link>
                  </div>
                )}
              </div>

              {/* What We Do */}
              <div
                className="nav-dropdown-item"
                style={{ position: "relative" }}
                onMouseEnter={() => setActiveDropdown("whatwedo")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to="/what-we-do/"
                  style={{
                    color: location.pathname.startsWith("/what-we-do") ? "#034464" : "#242424",
                    fontFamily: '"Basic", Sans-serif',
                    fontSize: "16px",
                    fontWeight: 500,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 0"
                  }}
                >
                  <span>What We Do</span>
                  <ChevronDown size={14} />
                </Link>

                {activeDropdown === "whatwedo" && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      minWidth: 270,
                      background: "#ffffff",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                      border: "1px solid #ebebeb",
                      borderRadius: 4,
                      padding: "10px 0",
                      zIndex: 1001,
                    }}
                  >
                    <Link to="/what-we-do/#forging" style={{ display: "block", padding: "10px 18px", color: "#333", textDecoration: "none", fontSize: "15px", fontFamily: '"Basic", Sans-serif' }}>🔧 Forging Solutions</Link>
                    <Link to="/what-we-do/#heattreatment" style={{ display: "block", padding: "10px 18px", color: "#333", textDecoration: "none", fontSize: "15px", fontFamily: '"Basic", Sans-serif' }}>🔥 Heat Treatment Technology</Link>
                    <Link to="/what-we-do/#manufacturing" style={{ display: "block", padding: "10px 18px", color: "#333", textDecoration: "none", fontSize: "15px", fontFamily: '"Basic", Sans-serif' }}>⚙️ Precision Machining</Link>
                    <Link to="/what-we-do/#qualitylab" style={{ display: "block", padding: "10px 18px", color: "#333", textDecoration: "none", fontSize: "15px", fontFamily: '"Basic", Sans-serif' }}>🧪 Quality &amp; Testing</Link>
                    <Link to="/what-we-do/#research" style={{ display: "block", padding: "10px 18px", color: "#333", textDecoration: "none", fontSize: "15px", fontFamily: '"Basic", Sans-serif' }}>💡 Research &amp; Development</Link>
                    <Link to="/what-we-do/#csr-activity" style={{ display: "block", padding: "10px 18px", color: "#333", textDecoration: "none", fontSize: "15px", fontFamily: '"Basic", Sans-serif' }}>🌱 CSR Activity</Link>
                  </div>
                )}
              </div>

              {/* Product Application */}
              <div
                className="nav-dropdown-item"
                style={{ position: "relative" }}
                onMouseEnter={() => setActiveDropdown("products")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to="/product-application/"
                  style={{
                    color: location.pathname.startsWith("/product-application") ? "#034464" : "#242424",
                    fontFamily: '"Basic", Sans-serif',
                    fontSize: "16px",
                    fontWeight: 500,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 0"
                  }}
                >
                  <span>Product Application</span>
                  <ChevronDown size={14} />
                </Link>

                {activeDropdown === "products" && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      minWidth: 280,
                      background: "#ffffff",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                      border: "1px solid #ebebeb",
                      borderRadius: 4,
                      padding: "10px 0",
                      zIndex: 1001,
                    }}
                  >
                    <Link to="/product-application/front-axle-shaft/" style={{ display: "block", padding: "10px 18px", color: "#333", textDecoration: "none", fontSize: "15px", fontFamily: '"Basic", Sans-serif' }}>Front Axle Parts</Link>
                    <Link to="/product-application/rear-axle-shaft/" style={{ display: "block", padding: "10px 18px", color: "#333", textDecoration: "none", fontSize: "15px", fontFamily: '"Basic", Sans-serif' }}>Rear Axle Parts</Link>
                    <Link to="/product-application/gear-box-parts/" style={{ display: "block", padding: "10px 18px", color: "#333", textDecoration: "none", fontSize: "15px", fontFamily: '"Basic", Sans-serif' }}>Gear Box Parts</Link>
                    <Link to="/product-application/driveline-parts/" style={{ display: "block", padding: "10px 18px", color: "#333", textDecoration: "none", fontSize: "15px", fontFamily: '"Basic", Sans-serif' }}>Driveline Parts</Link>
                    <Link to="/product-application/hydraulic-parts/" style={{ display: "block", padding: "10px 18px", color: "#333", textDecoration: "none", fontSize: "15px", fontFamily: '"Basic", Sans-serif' }}>Hydraulic Parts</Link>
                    <Link to="/product-application/planetary-wheel-drive-parts/" style={{ display: "block", padding: "10px 18px", color: "#333", textDecoration: "none", fontSize: "15px", fontFamily: '"Basic", Sans-serif' }}>Planetary Wheel Drive Parts</Link>
                  </div>
                )}
              </div>

              {/* Career */}
              <Link
                to="/career/"
                style={{
                  color: location.pathname === "/career" || location.pathname === "/career/" ? "#034464" : "#242424",
                  fontFamily: '"Basic", Sans-serif',
                  fontSize: "16px",
                  fontWeight: 500,
                  textDecoration: "none",
                  padding: "4px 0"
                }}
              >
                Career
              </Link>
            </nav>

            {/* Mobile menu hamburger button */}
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 6,
                color: "#034464",
              }}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
