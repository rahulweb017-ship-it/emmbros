import { execSync } from "node:child_process";
import * as cheerio from "cheerio";

const pages = [
  "home.html",
  "who-we-are.html",
  "what-we-do.html",
  "product-application.html",
  "front-axle-shaft.html",
  "rear-axle-shaft.html",
  "gear-box-parts.html",
  "driveline-parts.html",
  "hydraulic-parts.html",
  "planetary-wheel-drive-parts.html",
  "career.html"
];

for (const p of pages) {
  try {
    const html = execSync(`git show HEAD:client/public/pages/${p}`, { maxBuffer: 15 * 1024 * 1024 }).toString("utf8");
    const $ = cheerio.load(html);
    const hdr = $(".ekit-template-content-header").length;
    const ftr = $(".ekit-template-content-footer").length;
    console.log(p.padEnd(35), "Header elements:", hdr, "Footer elements:", ftr);
  } catch (e) {
    console.error("Error on", p, e.message);
  }
}
