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

console.log("=== All <style> tags in home.html ===");
$h("style").each((i, el) => {
  const id = $h(el).attr("id") || "no-id";
  const len = ($h(el).html() || "").length;
  console.log(`id: ${id}, len: ${len}`);
});

console.log("\n=== All <style> tags in who-we-are.html ===");
$w("style").each((i, el) => {
  const id = $w(el).attr("id") || "no-id";
  const len = ($w(el).html() || "").length;
  console.log(`id: ${id}, len: ${len}`);
});
