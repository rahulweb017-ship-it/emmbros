import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.resolve(__dirname, "../../client/public/pages");
const homeHtml = fs.readFileSync(path.join(PAGES_DIR, "home.html"), "utf8");
const $ = cheerio.load(homeHtml);

console.log("=== HEADER SECTION STRUCTURE ===");
const $hdr = $(".ekit-template-content-header");
console.log("Header top children:", $hdr.children().map((_, el) => el.tagName + "." + ($(el).attr("class") || "").split(" ").slice(0, 3).join(".")).get());

console.log("\nTop bar contact info:");
$hdr.find(".elementor-icon-list-item").each((_, el) => console.log("  Icon list:", $(el).text().trim()));

console.log("\nNavigation items:");
$hdr.find("ul.elementskit-navbar-nav > li").each((_, li) => {
  const title = $(li).children("a").text().trim();
  const sub = $(li).find("ul.elementskit-dropdown > li > a").map((_, a) => $(a).text().trim()).get();
  console.log("  Nav:", title, sub.length ? "-> Sub: " + sub.join(", ") : "");
});

console.log("\n=== FOOTER SECTION STRUCTURE ===");
const $ftr = $(".ekit-template-content-footer");
console.log("Footer top children:", $ftr.children().map((_, el) => el.tagName + "." + ($(el).attr("class") || "").split(" ").slice(0, 3).join(".")).get());
$ftr.find(".elementor-heading-title").each((_, el) => console.log("  Heading:", $(el).text().trim()));
