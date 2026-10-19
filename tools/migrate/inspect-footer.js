import { execSync } from "node:child_process";
import * as cheerio from "cheerio";

const html = execSync("git show HEAD:client/public/pages/home.html", { maxBuffer: 15 * 1024 * 1024 }).toString("utf8");
const $ = cheerio.load(html);
const footer = $(".ekit-template-content-footer");

console.log("=== FOOTER TEXTS ===");
footer.find("h1, h2, h3, h4, h5, h6, p, a, li").each((_, el) => {
  const t = $(el).text().trim();
  if (t && t.length < 100) console.log($(el).prop("tagName"), "->", t);
});

console.log("\n=== FOOTER IMAGES ===");
footer.find("img").each((_, el) => {
  console.log($(el).attr("src"));
});
