import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.resolve(__dirname, "../../client/public/pages");
const homeHtml = fs.readFileSync(path.join(PAGES_DIR, "home.html"), "utf8");
const $ = cheerio.load(homeHtml);

console.log("=== HEAD STYLES AND LINKS IN HOME.HTML ===");
$("link[rel=stylesheet]").each((_, el) => {
  console.log("CSS Link:", $(el).attr("id"), $(el).attr("href"));
});
$("style").each((i, el) => {
  const id = $(el).attr("id") || `inline-${i}`;
  const txt = $(el).text();
  console.log("Style Tag:", id, `(${txt.length} chars)`);
});
