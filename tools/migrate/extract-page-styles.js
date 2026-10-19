import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.resolve(__dirname, "../../client/public/pages");
const map = JSON.parse(fs.readFileSync(path.join(__dirname, "asset-copy-map.json"), "utf8"));

const pages = [
  { slug: "home", file: "home.html", comp: "Home" },
  { slug: "who-we-are", file: "who-we-are.html", comp: "WhoWeAre" },
  { slug: "what-we-do", file: "what-we-do.html", comp: "WhatWeDo" },
  { slug: "product-application", file: "product-application.html", comp: "ProductApplication" },
  { slug: "front-axle-shaft", file: "front-axle-shaft.html", comp: "FrontAxleShaft", sub: "products" },
  { slug: "rear-axle-shaft", file: "rear-axle-shaft.html", comp: "RearAxleShaft", sub: "products" },
  { slug: "gear-box-parts", file: "gear-box-parts.html", comp: "GearBoxParts", sub: "products" },
  { slug: "driveline-parts", file: "driveline-parts.html", comp: "DrivelineParts", sub: "products" },
  { slug: "hydraulic-parts", file: "hydraulic-parts.html", comp: "HydraulicParts", sub: "products" },
  { slug: "planetary-wheel-drive-parts", file: "planetary-wheel-drive-parts.html", comp: "PlanetaryWheelDriveParts", sub: "products" },
  { slug: "career", file: "career.html", comp: "Career" },
];

for (const p of pages) {
  const html = fs.readFileSync(path.join(PAGES_DIR, p.file), "utf8");
  const $ = cheerio.load(html);
  
  // Extract custom page-level styles
  let pageCss = "";
  $("style").each((_, el) => {
    const id = $(el).attr("id") || "";
    const txt = $(el).text();
    // Exclude popup maker and hero slider (which will be self-contained in React components)
    if (!id.includes("popup-maker") && !id.includes("hero-slider") && !id.includes("wp-emoji")) {
      pageCss += `\n/* Style: ${id} */\n` + txt;
    }
  });

  // Rewrite asset references inside page CSS
  for (const [orig, item] of Object.entries(map)) {
    if (pageCss.includes(orig)) {
      pageCss = pageCss.replaceAll(orig, item.targetRel);
    }
  }

  const outCss = path.resolve(__dirname, `../../client/src/styles/pages/${p.slug}.css`);
  fs.writeFileSync(outCss, pageCss);
  console.log(`Generated page stylesheet: ${p.slug}.css (${pageCss.length} bytes)`);
}
