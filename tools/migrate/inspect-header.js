import fs from "node:fs";
import * as cheerio from "cheerio";

const html = fs.readFileSync("client/public/pages/home.html", "utf8");
const $ = cheerio.load(html);
const header = $(".ekit-template-content-header");

console.log("=== HEADER IMAGES ===");
header.find("img").each((_, el) => {
  console.log($(el).attr("src"), $(el).attr("alt"), $(el).attr("width"), $(el).attr("height"));
});

console.log("=== HEADER ICONS / LINKS ===");
header.find("a").each((_, el) => {
  console.log($(el).text().trim(), "->", $(el).attr("href"));
});

console.log("=== HEADER STYLE IDS ===");
header.find("style").each((_, el) => {
  console.log($(el).attr("id"));
});
