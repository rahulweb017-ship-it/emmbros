import { execSync } from "node:child_process";
import * as cheerio from "cheerio";

const html = execSync("git show HEAD:client/public/pages/home.html", {
  maxBuffer: 15 * 1024 * 1024,
}).toString("utf8");
const $ = cheerio.load(html);

console.log("=== STYLESHEET LINKS ===");
$('link[rel="stylesheet"]').each((_, el) => {
  const id = $(el).attr("id") || "";
  const href = $(el).attr("href") || "";
  console.log(id.padEnd(35), "->", href);
});

console.log("\n=== READ MORE BUTTON ===");
$('a:contains("Read More")').each((_, el) => {
  console.log($(el).prop("outerHTML"));
});

console.log("\n=== CERTIFIED LIST ===");
$('li:contains("Certified ISO 9001")').each((_, el) => {
  console.log($(el).prop("outerHTML"));
});

console.log("\n=== PRODUCT APPLICATION SECTION ===");
$(':contains("Our Product Application")').each((_, el) => {
  if ($(el).is("h2, h3, div")) {
    const parentSection = $(el).closest(".elementor-section, .e-con, section, div[class*='section']");
    console.log("Section tag:", parentSection.prop("tagName"), "classes:", parentSection.attr("class"));
    console.log("Section style:", parentSection.attr("style"));
  }
});
