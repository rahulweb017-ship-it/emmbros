import React from "react";
import { Link } from "react-router-dom";
import { PageMeta } from "../components/common/PageMeta";

export function IndustriesClients() {
  return (
    <article className="seo-dedicated-page" style={{ background: "#ffffff", color: "#1e293b" }}>
      <PageMeta canonicalUrl="/industries-clients" />

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
            Tier-1 &amp; Tier-2 Global OEM Partner Since 1991
          </p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, margin: "0 0 16px", color: "#ffffff" }}>
            Automotive Industries &amp; OEM Clients Served Worldwide
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 840, color: "#e2e8f0", margin: 0 }}>
            From heavy commercial trucks and agricultural tractors to construction excavators and electric utility vehicles, Emmbros Autocomp Ltd supplies high-torque forged and CNC-machined driveline components to leading OEMs across India, Europe, and North America.
          </p>
        </div>
      </section>

      {/* Industries Served */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 20px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#002c40", marginBottom: 16 }}>
          Core Mobility &amp; Industrial Sectors We Power
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: "#334155", marginBottom: 28 }}>
          Operating three specialized forging, heat-treatment, and precision CNC machining plants in Baddi, District Solan, Himachal Pradesh, Emmbros Autocomp Limited engineers custom closed-die press forgings and horizontal upsetter forgings ranging from 0.5 kg to 65 kg. Our driveline and transmission components are built to withstand high torsional shock loads, severe off-road articulation, mud and water ingress, and continuous heavy-haul duty cycles across primary industrial segments:
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
            marginBottom: 44,
          }}
        >
          <div style={{ padding: 24, border: "1px solid #e2e8f0", borderRadius: 8, background: "#f8fafc" }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#002c40", marginBottom: 10 }}>
              1. Heavy &amp; Light Commercial Vehicles
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: "0 0 12px" }}>
              Full-floating and semi-floating <Link to="/product-application/rear-axle-shaft" style={{ color: "#034464", fontWeight: 600 }}>rear axle shafts</Link>, propeller shaft yokes, companion flanges, wheel hubs, and transmission gears for LCVs, MCVs, HCVs, buses, tippers, and multi-axle commercial trucks.
            </p>
          </div>

          <div style={{ padding: 24, border: "1px solid #e2e8f0", borderRadius: 8, background: "#f8fafc" }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#002c40", marginBottom: 10 }}>
              2. Agricultural Tractors &amp; Harvesters
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: "0 0 12px" }}>
              4WD <Link to="/product-application/front-axle-shaft" style={{ color: "#034464", fontWeight: 600 }}>front axle shafts</Link>, bull pinion shafts, crown wheel forgings, PTO shafts, <Link to="/product-application/hydraulic-parts" style={{ color: "#034464", fontWeight: 600 }}>hydraulic lift shafts</Link>, rockshafts, and planetary carriers for 20 HP to 130 HP farm tractors and combine harvesters.
            </p>
          </div>

          <div style={{ padding: 24, border: "1px solid #e2e8f0", borderRadius: 8, background: "#f8fafc" }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#002c40", marginBottom: 10 }}>
              3. Off-Highway &amp; Construction Equipment
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: "0 0 12px" }}>
              Heavy-duty <Link to="/product-application/planetary-wheel-drive-parts" style={{ color: "#034464", fontWeight: 600 }}>planetary wheel drive hubs</Link>, ring gears, sun gears, and <Link to="/product-application/driveline-parts" style={{ color: "#034464", fontWeight: 600 }}>cardan shafts</Link> for backhoe loaders, wheeled excavators, soil compactors, telehandlers, and rough-terrain cranes.
            </p>
          </div>

          <div style={{ padding: 24, border: "1px solid #e2e8f0", borderRadius: 8, background: "#f8fafc" }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#002c40", marginBottom: 10 }}>
              4. SUVs, Pickups &amp; EV Drivelines
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: "0 0 12px" }}>
              Near-net-shape forged differential shafts, <Link to="/product-application/gear-box-parts" style={{ color: "#034464", fontWeight: 600 }}>gearbox shafts</Link>, cold-rolled involute splines, and electric vehicle e-axle output shafts engineered for low NVH and high torque-to-weight ratios.
            </p>
          </div>
        </div>

        {/* OEM Clients Section */}
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#002c40", marginBottom: 16 }}>
          Trusted by Leading Domestic &amp; International OEMs
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: "#334155", marginBottom: 24 }}>
          Our commitment to on-time delivery, zero-PPM defect targets, in-house CAD/CAM die manufacturing, and competitive value engineering has made Emmbros Autocomp Ltd a preferred manufacturing partner for major automotive OEMs and Tier-1 axle assemblers. Our customer portfolio spans Tata Motors, Ashok Leyland, Mahindra &amp; Mahindra, Escorts Kubota, TAFE, Sonalika International Tractors, Swaraj, CNH Industrial (New Holland), JCB, Dana, and Meritor, alongside global aftermarket exports across 25+ countries under our <a href="https://emmpower.in/" target="_blank" rel="noopener noreferrer" style={{ color: "#034464", fontWeight: 600 }}>Emmpower</a> brand.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 20,
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <img src="/assets/images/tata-1.webp" alt="Tata Motors OEM Client Logo" width="180" height="90" loading="lazy" style={{ maxWidth: "100%", height: "auto", margin: "0 auto" }} />
          <img src="/assets/images/ashok-leyland.webp" alt="Ashok Leyland OEM Client Logo" width="180" height="90" loading="lazy" style={{ maxWidth: "100%", height: "auto", margin: "0 auto" }} />
          <img src="/assets/images/mahindra.webp" alt="Mahindra Tractor and Auto OEM Client Logo" width="180" height="90" loading="lazy" style={{ maxWidth: "100%", height: "auto", margin: "0 auto" }} />
          <img src="/assets/images/kubota.webp" alt="Escorts Kubota OEM Client Logo" width="180" height="90" loading="lazy" style={{ maxWidth: "100%", height: "auto", margin: "0 auto" }} />
          <img src="/assets/images/sonalika.webp" alt="Sonalika Tractors OEM Client Logo" width="180" height="90" loading="lazy" style={{ maxWidth: "100%", height: "auto", margin: "0 auto" }} />
          <img src="/assets/images/new-holland.webp" alt="New Holland Agriculture OEM Client Logo" width="180" height="90" loading="lazy" style={{ maxWidth: "100%", height: "auto", margin: "0 auto" }} />
        </div>

        {/* CTA Banner */}
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
              Partner With an IATF 16949 Certified Forging Supplier
            </h2>
            <p style={{ fontSize: 15, color: "#475569", margin: 0 }}>
              Send us your engineering drawings or 3D CAD models for rapid tooling development and OEM volume production.
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
            Request an OEM Quote
          </Link>
        </div>
      </section>
    </article>
  );
}
