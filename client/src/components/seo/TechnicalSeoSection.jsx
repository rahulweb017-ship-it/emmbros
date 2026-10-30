import React from "react";
import { Link } from "react-router-dom";

const SECTION_CONTENT = {
  "what-we-do": {
    heading: "Integrated Closed-Die Forging, Heat Treatment & Precision CNC Machining in Baddi",
    intro:
      "At Emmbros Autocomp Limited, our vertically integrated manufacturing ecosystem in Baddi, Himachal Pradesh combines heavy-duty closed-die press forging, horizontal upsetter forging, controlled-atmosphere heat treatment, mid-frequency induction hardening, and multi-axis CNC machining under a single IATF 16949:2016 certified roof. Since 1991, we have engineered safety-critical automotive forgings from 0.5 kg to 65 kg for commercial vehicles, tractors, and off-highway equipment.",
    cards: [
      {
        title: "Closed-Die Press & Horizontal Upsetter Forging",
        text: "Our forging shop features high-tonnage mechanical forging presses and horizontal upsetters paired with automated billet induction heaters and pyrometer temperature controls, ensuring optimal grain flow alignment across flanged axle shafts, yokes, and gear blanks.",
      },
      {
        title: "Continuous Normalizing, Quenching & Induction Hardening",
        text: "In-house heat treatment lines perform normalizing, hardening, tempering, and computer-controlled vertical induction scanning to achieve deep effective case depths (52–60 HRC) and superior torsional fatigue strength.",
      },
      {
        title: "CNC Turning, Spline Rolling & Hobbing",
        text: "Dedicated cellular machining lines utilize CNC turning centers, vertical machining centers (VMCs), cold spline rolling machines, gear hobbing, and cylindrical grinding to hold tight micron-level tolerances.",
      },
    ],
  },
  "rear-axle-shaft": {
    heading: "OEM Rear Axle Shaft Specifications, Metallurgy & Manufacturing Process",
    intro:
      "Emmbros Autocomp Limited is one of India's premier OEM manufacturers of heavy-duty rear axle shafts in Baddi, Himachal Pradesh. Engineered for high torsional yield strength and bending fatigue life, our full-floating, semi-floating, and flanged rear axle shafts are trusted by leading commercial truck, bus, utility vehicle, and agricultural tractor manufacturers including Tata Motors, Ashok Leyland, and Mahindra.",
    cards: [
      {
        title: "Alloy & Carbon-Boron Steel Grades",
        text: "Manufactured from ultrasonic-tested EN8D (SAE 1045), SAE 1541, SAE 15B41, EN19 (SAE 4140 / 42CrMo4), and EN24 alloy steels with complete mill-to-dispatch heat number traceability.",
      },
      {
        title: "Upsetter Forging & Cold-Rolled Involute Splines",
        text: "Multi-pass horizontal upsetter forging forms high-integrity wheel flanges with continuous radial grain flow, followed by CNC turning and cold spline rolling or hobbing to DIN 5480, ANSI B92.1, and JIS standards.",
      },
      {
        title: "Full-Length Induction Hardening & 100% MPI Testing",
        text: "Automated vertical induction scanners deliver uniform case depth along the shaft body, fillet radius, and spline root, validated by micro-hardness traversal and 100% fluorescent magnetic particle inspection.",
      },
    ],
  },
  "front-axle-shaft": {
    heading: "4WD Front Axle Shafts, Stub Axles & Steering Drive Components for OEMs",
    intro:
      "Designed for severe off-road articulation and high steering angles, Emmbros Autocomp Limited manufactures precision-forged front axle shafts, 4WD wheel drive shafts, stub axles, and steering spindles at our IATF 16949:2016 certified plant in Baddi, Himachal Pradesh. Our front axle components power four-wheel-drive agricultural tractors, commercial utility vehicles, and backhoe loaders across domestic and export markets.",
    cards: [
      {
        title: "High-Strength Alloy Steel Forgings",
        text: "Closed-die forged from 42CrMo4 (EN19), 20MnCr5, SAE 4140, and micro-alloyed steels to resist combined torsional torque and dynamic steering shock loads in muddy and rocky terrain.",
      },
      {
        title: "Precision Yoke Ears, Bearing Journals & Splines",
        text: "Machined on automated CNC turning and VMC cells to maintain concentricity, bearing seat cylindricity, seal journal surface finish (Ra < 0.4 µm), and cross-hole alignment for universal joint assemblies.",
      },
      {
        title: "Selective Induction Hardening & Carburizing",
        text: "Critical wear surfaces, kingpin journals, and involute splines undergo selective induction hardening or case carburizing, followed by ultrasonic and magnetic particle non-destructive testing.",
      },
    ],
  },
  "driveline-parts": {
    heading: "Heavy-Duty Forged Driveline Parts, Cardan Shafts, Slip Yokes & Flange Yokes",
    intro:
      "Emmbros Autocomp Limited engineers and manufactures a comprehensive range of forged and CNC-machined driveline parts in Baddi, Himachal Pradesh. Our driveline portfolio includes propeller shaft components, cardan shafts, flange yokes, slip yokes, weld yokes, companion flanges, universal joint crosses, and differential spiders for medium and heavy commercial vehicles, buses, and off-highway machinery.",
    cards: [
      {
        title: "Closed-Die Near-Net-Shape Yoke Forging",
        text: "High-precision closed-die press forging ensures symmetrical ear geometry, dense fibrous grain structure, and minimal machining allowance across flange yokes, slip yokes, and end yokes.",
      },
      {
        title: "Internal Broaching, Fine Boring & Dynamic Balance",
        text: "Equipped with high-tonnage vertical broaching for internal involute splines, twin-spindle fine boring for snap-ring and needle-bearing cross holes, and precision face serration milling.",
      },
      {
        title: "OEM Durability & Global Export Standards",
        text: "Every driveline forging undergoes dimensional CMM verification, hardness testing, and crack detection to ensure zero-vibration power transmission from the gearbox to the drive axle.",
      },
    ],
  },
  "gear-box-parts": {
    heading: "Precision Forged Gearbox Parts, Transmission Shafts, Planet Carriers & Sprockets",
    intro:
      "Our Baddi, Himachal Pradesh manufacturing units supply high-precision forged and machined gearbox parts for manual, synchromesh, constant-mesh, and powershift transmissions. Emmbros Autocomp Limited produces main shafts, counter shafts, input pinions, transmission gears, planet carriers, shift forks, and drive sprockets engineered for quiet meshing and long service life.",
    cards: [
      {
        title: "Case-Hardening & Through-Hardening Steels",
        text: "Forged from certified 16MnCr5, 20MnCr5, SAE 8620, EN353, and 42CrMo4 steels with controlled hardenability bands (Jominy tested) for distortion-free heat treatment.",
      },
      {
        title: "Isothermal Annealing & Gear Blank Preparation",
        text: "Controlled normalizing and isothermal annealing produce uniform ferrite-pearlite microstructures for superior gear hobbing, shaping, shaving, and profile grinding machinability.",
      },
      {
        title: "Tight Runout & Tooth Profile Accuracy",
        text: "Multi-axis CNC turning, spline rolling, and gear cutting operations maintain strict pitch-circle runout, lead, and involute profile tolerances required by Tier-1 transmission OEMs.",
      },
    ],
  },
  "hydraulic-parts": {
    heading: "Forged Hydraulic Lift Shafts, Rockshafts, Cylinder Pistons & Fluid Power Parts",
    intro:
      "Agricultural tractors, excavators, and material-handling equipment rely on leak-free, high-pressure hydraulic linkage systems. Emmbros Autocomp Limited manufactures heavy-duty forged hydraulic lift shafts (rockshafts), hydraulic cylinder pistons, gland nuts, clevis rod ends, and brake pistons in Baddi, Himachal Pradesh for leading tractor and construction OEMs.",
    cards: [
      {
        title: "High-Torque Tractor Hydraulic Lift Shafts",
        text: "Upset-forged and CNC-machined rockshafts with internal and external involute splines engineered to lift heavy three-point hitch agricultural implements without torsional twist.",
      },
      {
        title: "Mirror-Finish Cylinder Pistons & Brake Components",
        text: "Precision CNC turning and cylindrical grinding achieve super-finished seal grooves and outer diameters that prevent hydraulic fluid bypass and extend elastomeric seal life.",
      },
      {
        title: "Ultrasonic Soundness & Cleanliness Compliance",
        text: "100% ultrasonic testing for internal porosity, magnetic particle inspection, and dedicated ultrasonic washing stations ensure millipore cleanliness compliance before OEM assembly.",
      },
    ],
  },
  "planetary-wheel-drive-parts": {
    heading: "OEM Planetary Wheel Drive Hubs, Carriers, Spindles & Final Drive Forgings",
    intro:
      "Off-highway construction machinery, 4WD agricultural tractors, and heavy mining trucks utilize planetary hub reduction axles to multiply wheel torque while reducing differential stress. Emmbros Autocomp Limited manufactures forged planetary carriers, wheel flange hubs, wheel spindles, sun gear shafts, and ring gear supports in Baddi, Himachal Pradesh.",
    cards: [
      {
        title: "Heavy-Duty Planetary Carriers & Wheel Hubs",
        text: "Closed-die forged up to 65 kg from high-tensile alloy steels to withstand extreme radial wheel loads, impact shocks, and planetary pin bearing forces.",
      },
      {
        title: "True-Position Pin Hole Boring &VMC Machining",
        text: "Machined on 4-axis vertical machining centers with fixture probing to hold micron-level true position, perpendicularity, and bore cylindricity across planetary pinion shafts.",
      },
      {
        title: "Validated by CMM & Metallurgical Testing",
        text: "Every lot is verified on 3D Coordinate Measuring Machines (CMM) and tested for core tensile strength, impact toughness (Charpy V-notch), and induction case hardness.",
      },
    ],
  },
  blog: {
    heading: "Technical Insights on Automotive Forging, Metallurgy & Driveline Engineering",
    intro:
      "Welcome to the Emmbros Autocomp Limited technical knowledge hub. Our engineering, die-design, and metallurgical specialists in Baddi, Himachal Pradesh publish practical articles covering closed-die press forging, horizontal upsetter forging, induction heat treatment, cold spline rolling, CNC multi-axis machining, and IATF 16949:2016 quality assurance for OEM procurement teams, automotive drivetrain designers, commercial truck builders, and agricultural tractor engineers worldwide. Whether you are evaluating material hardenability, spline root stress, or PPAP documentation, our technical guides share over three decades of production expertise since 1991.",
    cards: [
      {
        title: "Axle Shaft Design & Torsional Fatigue Optimization",
        text: "Learn how multi-pass upset-forged radial grain flow, fillet cold rolling, and mid-frequency vertical induction scanning multiply torsional fatigue life and shock resistance in commercial vehicle, bus, and tractor rear axle shafts operating under extreme payload conditions.",
      },
      {
        title: "Alloy Steel Selection & Controlled Heat Treatment",
        text: "Compare carbon-manganese-boron steels (SAE 1541, SAE 15B41), chromium-molybdenum steels (42CrMo4 / EN19 / SAE 4140), and case-hardening alloy grades (20MnCr5, 16MnCr5, SAE 8620) for heavy-duty driveline yokes, transmission gears, planet carriers, and hydraulic lift shafts.",
      },
      {
        title: "OEM Quality Assurance & PPAP Level-3 Documentation",
        text: "Discover how optical emission spectroscopy, ultrasonic internal flaw detection, fluorescent magnetic particle inspection (MPI), 3D CMM metrology, and Statistical Process Control (SPC) prevent defects in high-volume automotive Tier-1 production.",
      },
    ],
  },
  careers: {
    heading: "Why Build Your Automotive Engineering & Manufacturing Career at Emmbros Baddi",
    intro:
      "Since 1991, Emmbros Autocomp Limited has grown into a premier Tier-1 automotive forging and precision CNC machining employer in Baddi, District Solan, Himachal Pradesh. Across our three modern manufacturing plants, mechanical engineers, metallurgists, CNC programmers, CAD/CAM die designers, maintenance engineers, and quality assurance specialists collaborate to build mission-critical rear axle shafts and driveline parts for India and global export markets.",
    cards: [
      {
        title: "Hands-On Advanced Forging & CNC Technology",
        text: "Work directly with high-tonnage closed-die mechanical forging presses, horizontal upsetters, automated vertical induction hardening scanners, 4-axis vertical machining centers (VMCs), cold spline rolling machines, and 3D CMM metrology systems.",
      },
      {
        title: "IATF 16949 Culture & Continuous Technical Learning",
        text: "Gain hands-on certified training in AIAG core automotive quality tools (APQP, PPAP, PFMEA, SPC, MSA), lean Six Sigma manufacturing, Total Productive Maintenance (TPM), and root-cause metallurgical failure analysis.",
      },
      {
        title: "Long-Term Career Growth in Himachal Pradesh's Industrial Hub",
        text: "We offer competitive compensation packages, structured leadership progression, safe industrial working environments, and the opportunity to engineer OEM driveline components for Tata Motors, Ashok Leyland, Mahindra, and international clients.",
      },
    ],
  },
};

export function TechnicalSeoSection({ sectionKey }) {
  const data = SECTION_CONTENT[sectionKey];
  if (!data) return null;

  return (
    <section
      className="emmbros-seo-technical-section"
      style={{
        background: "#f8fafc",
        borderTop: "1px solid #e2e8f0",
        padding: "56px 20px",
        color: "#1e293b",
        fontFamily: '"Basic", Sans-serif',
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#002c40", marginBottom: 14 }}>
          {data.heading}
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: "#334155", marginBottom: 28 }}>
          {data.intro}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            marginBottom: 32,
          }}
        >
          {data.cards.map((card, i) => (
            <div
              key={i}
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: 24,
              }}
            >
              <h3 style={{ fontSize: 19, fontWeight: 700, color: "#034464", margin: "0 0 10px" }}>
                {card.title}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569", margin: 0 }}>
                {card.text}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            paddingTop: 20,
            borderTop: "1px solid #e2e8f0",
            fontSize: 15,
            color: "#334155",
          }}
        >
          <div>
            <strong>Explore Related OEM Resources: </strong>
            <Link to="/product-application/rear-axle-shaft" style={{ color: "#034464", marginRight: 12 }}>
              Rear Axle Shafts
            </Link>
            <Link to="/product-application/front-axle-shaft" style={{ color: "#034464", marginRight: 12 }}>
              Front Axle Shafts
            </Link>
            <Link to="/product-application/driveline-parts" style={{ color: "#034464", marginRight: 12 }}>
              Driveline Parts
            </Link>
            <Link to="/quality-certifications" style={{ color: "#034464", marginRight: 12 }}>
              IATF 16949 Quality Lab
            </Link>
            <Link to="/industries-clients" style={{ color: "#034464", marginRight: 12 }}>
              Industries &amp; OEM Clients
            </Link>
            <Link to="/contact" style={{ color: "#034464" }}>
              Contact Baddi Plant
            </Link>
          </div>
          <Link
            to="/contact"
            style={{
              background: "#034464",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: 6,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Request OEM Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
