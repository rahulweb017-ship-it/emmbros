import React from "react";
import { Link } from "react-router-dom";
import { PageMeta } from "../components/common/PageMeta";
import { ContactForm } from "../components/forms/ContactForm";

export function Contact() {
  return (
    <article className="seo-dedicated-page" style={{ background: "#ffffff", color: "#1e293b" }}>
      <PageMeta canonicalUrl="/contact" />

      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #002c40 0%, #034464 100%)",
          color: "#ffffff",
          padding: "60px 20px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ textTransform: "uppercase", letterSpacing: 1.5, fontSize: 13, color: "#93c5fd", marginBottom: 10 }}>
            Direct OEM Engineering &amp; Sales Support
          </p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, margin: "0 0 16px", color: "#ffffff" }}>
            Contact Emmbros Autocomp Ltd in Baddi, Himachal Pradesh
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 840, color: "#e2e8f0", margin: 0 }}>
            Connect with our metallurgical and driveline engineering team in Baddi, District Solan, Himachal Pradesh for custom OEM rear axle shafts, front axle shafts, closed-die forgings, and precision CNC-machined components.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 40,
            alignItems: "start",
          }}
        >
          {/* Left Column: Plant Locations & Contact Details */}
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#002c40", marginBottom: 16 }}>
              Manufacturing Plants &amp; Corporate Office
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#334155", marginBottom: 24 }}>
              Established in 1991, Emmbros Autocomp Limited operates three vertically integrated closed-die forging, horizontal upsetter forging, continuous heat-treatment, induction hardening, and CNC machining facilities in the industrial hub of Baddi, Himachal Pradesh. Located within close logistical reach of Chandigarh and major northern automotive corridors, our plants serve domestic OEM assembly lines and international export ports with rapid turnaround times. We welcome OEM vendor audits, technical RFQ discussions, PPAP sample development, and global distribution enquiries.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
              <div style={{ padding: 20, border: "1px solid #e2e8f0", borderRadius: 8, background: "#f8fafc" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#034464", margin: "0 0 8px" }}>
                  Registered &amp; Corporate Works (Baddi, Himachal Pradesh)
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: 0 }}>
                  Plot No. 63, EPIP Phase-1, Jharmajri, Baddi, District Solan, Himachal Pradesh – 174103, India. Equipped with closed-die forging presses, upsetters, vertical and horizontal CNC turning centers, spline rolling machines, and our central metallurgical laboratory.
                </p>
              </div>

              <div style={{ padding: 20, border: "1px solid #e2e8f0", borderRadius: 8, background: "#f8fafc" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#034464", margin: "0 0 8px" }}>
                  Direct Telephone, Email &amp; WhatsApp Desk
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: 0 }}>
                  Phone: <a href="tel:+919816931822" style={{ color: "#034464", fontWeight: 600 }}>+91-98169-31822</a> (Monday to Saturday, 9:00 AM – 6:00 PM IST)
                  <br />
                  Email: <a href="mailto:enquiry@emmbros.com" style={{ color: "#034464", fontWeight: 600 }}>enquiry@emmbros.com</a>
                </p>
              </div>

              <div style={{ padding: 20, border: "1px solid #e2e8f0", borderRadius: 8, background: "#f8fafc" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#034464", margin: "0 0 8px" }}>
                  OEM RFQ &amp; Product Lines
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: 0 }}>
                  Review our core product families before submitting your 2D/3D engineering drawings:{" "}
                  <Link to="/product-application/rear-axle-shaft" style={{ color: "#034464", fontWeight: 600 }}>Rear Axle Shafts</Link>,{" "}
                  <Link to="/product-application/front-axle-shaft" style={{ color: "#034464", fontWeight: 600 }}>Front Axle Shafts</Link>,{" "}
                  <Link to="/product-application/driveline-parts" style={{ color: "#034464", fontWeight: 600 }}>Driveline Parts</Link>,{" "}
                  <Link to="/product-application/gear-box-parts" style={{ color: "#034464", fontWeight: 600 }}>Gearbox Parts</Link>,{" "}
                  <Link to="/product-application/hydraulic-parts" style={{ color: "#034464", fontWeight: 600 }}>Hydraulic Parts</Link>, and{" "}
                  <Link to="/quality-certifications" style={{ color: "#034464", fontWeight: 600 }}>IATF 16949 Quality Lab</Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: RFQ / Contact Form */}
          <div style={{ padding: 28, border: "1px solid #e2e8f0", borderRadius: 8, background: "#ffffff", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#002c40", marginBottom: 12 }}>
              Request an OEM Forging or Machining Quote
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "#475569", marginBottom: 20 }}>
              Share your part specifications, annual volume requirements, alloy steel grade, heat-treatment specifications, or drawing attachments below and our engineering sales team will respond within 24 business hours.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </article>
  );
}
