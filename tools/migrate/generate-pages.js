import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.resolve(__dirname, "../../client/public/pages");
const SRC_PAGES = path.resolve(__dirname, "../../client/src/pages");
const map = JSON.parse(fs.readFileSync(path.join(__dirname, "asset-copy-map.json"), "utf8"));

const pages = [
  { slug: "home", file: "home.html", comp: "Home", title: "Emmbros Autocomp Ltd | Auto Parts Mfr in Baddi, HP", desc: "IATF 16949 certified rear axle shaft & driveline parts manufacturer in Baddi, HP since 1991. Trusted OEM supplier to Tata, Leyland & global clients worldwide", path: "/" },
  { slug: "who-we-are", file: "who-we-are.html", comp: "WhoWeAre", title: "About Emmbros Autocomp Ltd | Precision Engineering Baddi", desc: "Learn about Emmbros Autocomp Ltd, our history since 1991, leadership, and manufacturing excellence in automotive forgings.", path: "/who-we-are" },
  { slug: "what-we-do", file: "what-we-do.html", comp: "WhatWeDo", title: "Forging Capabilities: Press & Upsetter Forged Parts | Emmbros", desc: "Explore our press forging, upsetter forging, heat treatment, and precision machining capabilities.", path: "/what-we-do" },
  { slug: "product-application", file: "product-application.html", comp: "ProductApplication", title: "OEM Product Applications & Parts | Emmbros Autocomp", desc: "Overview of OEM automotive parts: axle shafts, gearbox components, cardan shafts, and hydraulic pistons.", path: "/product-application" },
  { slug: "front-axle-shaft", file: "front-axle-shaft.html", comp: "FrontAxleShaft", sub: "products", title: "Front Axle Shafts & Wheel Shafts Manufacturer | Emmbros Autocomp", desc: "Manufacturer of OEM front axle shafts, wheel shafts, and steering drive components.", path: "/product-application/front-axle-shaft" },
  { slug: "rear-axle-shaft", file: "rear-axle-shaft.html", comp: "RearAxleShaft", sub: "products", title: "OEM Rear Axle Shafts Manufacturer | Emmbros Autocomp", desc: "Specialist manufacturer of induction hardened rear axle shafts for commercial vehicles and tractors.", path: "/product-application/rear-axle-shaft" },
  { slug: "gear-box-parts", file: "gear-box-parts.html", comp: "GearBoxParts", sub: "products", title: "OEM Gearbox Parts, Planet Carriers & Sprockets | Emmbros", desc: "Precision forged and CNC machined transmission gears, planet carriers, and sprockets.", path: "/product-application/gear-box-parts" },
  { slug: "driveline-parts", file: "driveline-parts.html", comp: "DrivelineParts", sub: "products", title: "OEM Driveline Parts, Cardan Shafts & Yokes Manufacturer | Emmbros", desc: "Driveline assemblies, propeller shafts, cardan shafts, slip yokes, and flange yokes.", path: "/product-application/driveline-parts" },
  { slug: "hydraulic-parts", file: "hydraulic-parts.html", comp: "HydraulicParts", sub: "products", title: "OEM Hydraulic Parts & Brake Pistons Manufacturer | Emmbros", desc: "Precision automotive hydraulic cylinders, brake pistons, and fluid system assemblies.", path: "/product-application/hydraulic-parts" },
  { slug: "planetary-wheel-drive-parts", file: "planetary-wheel-drive-parts.html", comp: "PlanetaryWheelDriveParts", sub: "products", title: "Planetary Wheel Drive Parts & Flange Hubs | Emmbros", desc: "High-torque planetary wheel drive parts, ring gears, and flange hubs for heavy duty axles.", path: "/product-application/planetary-wheel-drive-parts" },
  { slug: "career", file: "career.html", comp: "Career", title: "Careers & Job Openings in Baddi | Emmbros Autocomp Ltd", desc: "Join the engineering team at Emmbros Autocomp Ltd in Baddi, Himachal Pradesh.", path: "/career" },
];

function sanitizeHtmlToJsx(rawHtml) {
  let s = rawHtml;
  // Replace asset references
  for (const [orig, item] of Object.entries(map)) {
    if (s.includes(orig)) {
      s = s.replaceAll(orig, item.targetRel);
    }
  }
  
  // Replace void tags not closed: <input>, <img>, <br>, <hr>
  s = s.replace(/<(img|input|br|hr)([^>]*?)(?<!\/)>/gi, "<$1$2 />");
  
  // Attribute name conversions:
  s = s.replace(/\bclass=/g, "className=");
  s = s.replace(/\bfor=/g, "htmlFor=");
  s = s.replace(/\btabindex=/g, "tabIndex=");
  s = s.replace(/\bautocomplete=/g, "autoComplete=");
  s = s.replace(/\bcolspan=/g, "colSpan=");
  s = s.replace(/\browspan=/g, "rowSpan=");
  s = s.replace(/\breadonly=/g, "readOnly=");
  s = s.replace(/\bmaxlength=/g, "maxLength=");
  s = s.replace(/\bframeborder=/g, "frameBorder=");
  s = s.replace(/\ballowfullscreen=/g, "allowFullScreen=");
  s = s.replace(/\bclip-path=/g, "clipPath=");
  s = s.replace(/\bfill-rule=/g, "fillRule=");
  s = s.replace(/\bclip-rule=/g, "clipRule=");
  s = s.replace(/\bstroke-width=/g, "strokeWidth=");
  s = s.replace(/\bstroke-linecap=/g, "strokeLinecap=");
  s = s.replace(/\bstroke-linejoin=/g, "strokeLinejoin=");

  // Inline style string conversion to style={{ ... }}
  s = s.replace(/style="([^"]*)"/g, (m, val) => {
    const rules = val.split(";").map(r => r.trim()).filter(Boolean);
    const obj = {};
    for (const r of rules) {
      const idx = r.indexOf(":");
      if (idx === -1) continue;
      const prop = r.slice(0, idx).trim();
      const value = r.slice(idx + 1).trim();
      // Keep css custom variables as-is or camelCase standard properties
      let jsProp = prop;
      if (!prop.startsWith("--")) {
        jsProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      }
      obj[jsProp] = value;
    }
    return `style={${JSON.stringify(obj)}}`;
  });

  return s;
}

for (const p of pages) {
  const html = fs.readFileSync(path.join(PAGES_DIR, p.file), "utf8");
  const $ = cheerio.load(html);

  // Extract page content between header and footer
  // Header is .ekit-template-content-header
  // Footer is .ekit-template-content-footer
  $(".ekit-template-content-header").remove();
  $(".ekit-template-content-footer").remove();
  $("script").remove();
  $("style").remove();
  $(".pum").remove(); // popup-maker popups
  $("#ht-ctc-chat").remove(); // whatsapp widget handled by React WhatsAppButton
  $(".xs_social_share_widget").remove();

  const mainContent = $("body").html() || "";
  const jsxContent = sanitizeHtmlToJsx(mainContent.trim());

  const targetDir = p.sub ? path.join(SRC_PAGES, p.sub) : SRC_PAGES;
  fs.mkdirSync(targetDir, { recursive: true });
  const targetFile = path.join(targetDir, `${p.comp}.jsx`);

  const code = `import React from "react";
import { PageMeta } from "../../components/common/PageMeta";
import "../../styles/pages/${p.slug}.css";

export function ${p.comp}() {
  return (
    <div className="page-${p.slug}-container">
      <PageMeta
        title="${p.title}"
        description="${p.desc}"
        canonicalUrl="${p.path}"
      />
      ${jsxContent}
    </div>
  );
}
`;

  fs.writeFileSync(targetFile, code);
  console.log(`Generated React component: ${p.comp}.jsx (${code.length} bytes)`);
}
