import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.join(__dirname, "../client/public/pages");

const homeHtml = fs.readFileSync(path.join(PAGES_DIR, "home.html"), "utf8");
const whoHtml = fs.readFileSync(path.join(PAGES_DIR, "who-we-are.html"), "utf8");

const $h = cheerio.load(homeHtml);
const $w = cheerio.load(whoHtml);

console.log("=== All links in home.html ===");
$h("link").each((i, el) => {
  console.log($h(el).attr("rel"), "->", $h(el).attr("href"));
});

console.log("\n=== All links in who-we-are.html ===");
$w("link").each((i, el) => {
  console.log($w(el).attr("rel"), "->", $w(el).attr("href"));
});
