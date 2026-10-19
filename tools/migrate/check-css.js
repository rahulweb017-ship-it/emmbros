import { execSync } from "node:child_process";
import * as cheerio from "cheerio";

const html = execSync("git show HEAD:client/public/pages/home.html", { maxBuffer: 15 * 1024 * 1024 }).toString("utf8");
const $ = cheerio.load(html);

console.log("=== UNNAMED STYLES IN BODY ===");
$("body style").each((i, el) => {
  const id = $(el).attr("id") || `body-unnamed-${i}`;
  const txt = $(el).text();
  console.log(`\n--- ${id} (${txt.length} bytes) ---`);
  console.log(txt.slice(0, 400));
});

console.log("=== LINK STYLESHEETS ===");
$('link[rel="stylesheet"]').each((_, el) => {
  console.log($(el).attr("id"), "=>", $(el).attr("href"));
});
