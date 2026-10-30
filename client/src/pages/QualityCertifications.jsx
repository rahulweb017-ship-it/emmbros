import React from "react";
import { Link } from "react-router-dom";
import { PageMeta } from "../components/common/PageMeta";

export function QualityCertifications() {
  return (
    <article className="seo-dedicated-page" style={{ background: "#ffffff", color: "#1e293b" }}>
      <PageMeta canonicalUrl="/quality-certifications" />

      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #002c40 0%, #034464 100%)",
          color: "#ffffff",
          padding: "64px 20px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ textTransform: "uppercase", letterSpacing: 1.5, fontSize: 13, color: "#93c5fd", marginBottom: 10 }}>
            Zero-Defect Automotive Manufacturing Standards
          </p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, margin: "0 0 16px", color: "#ffffff" }}>
            IATF 16949:2016 Quality Assurance &amp; Metallurgical Certifications
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 840, color: "#e2e8f0", margin: 0 }}>
            Since 1991, Emmbros Autocomp Limited has maintained stringent quality management systems in Baddi, Himachal Pradesh, delivering safety-critical forged rear axle shafts and driveline components to domestic and global OEMs.
          </p>
        </div>
      </section>

      {/* Core Certifications Section */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 20px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#002c40", marginBottom: 16 }}>
          Global Automotive Quality Management Certifications
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: "#334155", marginBottom: 24 }}>
          Every closed-die press forging, horizontal upsetter forging, and CNC-machined component produced across our three manufacturing plants in Baddi, District Solan, Himachal Pradesh is governed by internationally accredited quality frameworks. Our quality assurance protocols enforce full heat-number traceability from raw alloy steel bar procurement through billet shearing, closed-die forging, normalizing, induction hardening, spline rolling, and final dispatch. We partner exclusively with primary steel mills producing ultrasonic-tested carbon, alloy, and micro-alloy steel bars to guarantee internal soundness and inclusion ratings compliant with ASTM E45 and DIN 50602 standards.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            marginBottom: 40,
          }}
        >
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 24, background: "#f8fafc" }}>
            <img
              src="/assets/images/certificate-two.webp"
              alt="IATF 16949:2016 Automotive Quality Management Certificate at Emmbros Autocomp"
              width="360"
              height="260"
              loading="lazy"
              style={{ width: "100%", height: "auto", borderRadius: 6, marginBottom: 16 }}
            />
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#002c40", marginBottom: 8 }}>
              IATF 16949:2016 Certified
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: 0 }}>
              Certified to the highest international automotive quality standard for the manufacture of forged and machined axle shafts, transmission shafts, and driveline components with complete AIAG core tools compliance including APQP, PPAP Level 3, PFMEA, MSA, and SPC.
            </p>
          </div>

          <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 24, background: "#f8fafc" }}>
            <img
              src="/assets/images/certificate-four.webp"
              alt="ISO 9001:2015 Quality Management System Certificate at Emmbros Autocomp"
              width="360"
              height="260"
              loading="lazy"
              style={{ width: "100%", height: "auto", borderRadius: 6, marginBottom: 16 }}
            />
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#002c40", marginBottom: 8 }}>
              ISO 9001:2015 Accredited
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: 0 }}>
              Continuous process improvement, statistical process capability monitoring (Cp and Cpk exceeding 1.67 on critical bearing journals and involute splines), poka-yoke error-proofing stations, and documented 8D corrective action workflows across all production lines.
            </p>
          </div>
        </div>

        {/* Metallurgical & Metrology Lab Section */}
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#002c40", marginBottom: 16 }}>
          In-House Metallurgical &amp; Dimensional Metrology Laboratory
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: "#334155", marginBottom: 20 }}>
          Rear axle shafts, front drive shafts, and planetary wheel hubs endure extreme torsional shock loads, bending moments, and cyclic fatigue in commercial vehicles and agricultural tractors. To guarantee structural integrity and field reliability, our Baddi metallurgical and metrology laboratory executes comprehensive destructive and non-destructive validation on every production heat:
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <div style={{ padding: 20, border: "1px solid #e2e8f0", borderRadius: 8 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#034464", marginBottom: 8 }}>
              Optical Emission Spectroscopy
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: 0 }}>
              100% incoming alloy and carbon-manganese-boron steel chemical analysis (EN8D, EN19, EN24, 42CrMo4, SAE 1045, SAE 1541, SAE 4140, 20MnCr5, 16MnCr5) prior to billet cutting and induction heating.
            </p>
          </div>

          <div style={{ padding: 20, border: "1px solid #e2e8f0", borderRadius: 8 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#034464", marginBottom: 8 }}>
              Induction Case Depth &amp; Microstructure
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: 0 }}>
              Automated micro-Vickers and Rockwell hardness traversal, effective case depth profiling (52 to 60 HRC surface hardness with tough core ductility), grain flow macro-etching, and tempered martensitic microstructure verification.
            </p>
          </div>

          <div style={{ padding: 20, border: "1px solid #e2e8f0", borderRadius: 8 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#034464", marginBottom: 8 }}>
              CMM, Contour &amp; Non-Destructive Testing
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: 0 }}>
              3D Coordinate Measuring Machine (CMM) inspection, surface roughness and contour profilometry, ultrasonic internal flaw detection (UT), and 100% fluorescent wet magnetic particle inspection (MPI) for crack-free surface assurance.
            </p>
          </div>
        </div>

        {/* Related Links CTA */}
        <div
          style={{
            background: "#f1f5f9",
            borderRadius: 8,
            padding: 28,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#002c40", margin: "0 0 6px" }}>
              Need PPAP Level-3 Certified Forged Driveline Components?
            </h2>
            <p style={{ fontSize: 15, color: "#475569", margin: 0 }}>
              Explore our <Link to="/product-application/rear-axle-shaft" style={{ color: "#034464", fontWeight: 600 }}>OEM Rear Axle Shafts</Link>, <Link to="/product-application/driveline-parts" style={{ color: "#034464", fontWeight: 600 }}>Driveline Forgings</Link>, or <Link to="/what-we-do" style={{ color: "#034464", fontWeight: 600 }}>Manufacturing Capabilities</Link>.
            </p>
          </div>
          <Link
            to="/contact"
            style={{
              background: "#034464",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: 6,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Request Quality Audit &amp; Quote
          </Link>
        </div>
      </section>
    </article>
  );
}
