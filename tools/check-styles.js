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

const homeStyles = [];
$h("link[rel=stylesheet]").each((i, el) => {
  homeStyles.push($h(el).attr("href"));
});

const whoStyles = [];
$w("link[rel=stylesheet]").each((i, el) => {
  whoStyles.push($w(el).attr("href"));
});

console.log("=== Stylesheets on home.html ===");
console.log(homeStyles.join("\n"));

console.log("\n=== Stylesheets on who-we-are.html ===");
console.log(whoStyles.join("\n"));

console.log("\n=== Styles on home not in who-we-are ===");
const diff = homeStyles.filter(x => !whoStyles.includes(x));
console.log(diff.join("\n"));
