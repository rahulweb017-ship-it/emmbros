import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.resolve(__dirname, "../../client/public/pages");
const PUBLIC_DIR = path.resolve(__dirname, "../../client/public");

const assetRefs = new Set();

for (const f of fs.readdirSync(PAGES_DIR)) {
  const html = fs.readFileSync(path.join(PAGES_DIR, f), "utf8");
  const $ = cheerio.load(html);
  
  $("[src]").each((_, el) => {
    const src = $(el).attr("src");
    if (src && !src.startsWith("http") && !src.startsWith("data:")) assetRefs.add(src.split("?")[0]);
  });
  $("[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (href && /\.(png|jpg|jpeg|webp|gif|svg|pdf|mp4|webm|woff2?|ttf|eot)$/i.test(href.split("?")[0])) {
      assetRefs.add(href.split("?")[0]);
    }
  });
  
  // Extract background-image from inline style attributes and style tags
  const bgRegex = /url\(['"]?(\/[^'"\)]+)['"]?\)/g;
  let match;
  while ((match = bgRegex.exec(html)) !== null) {
    if (!match[1].startsWith("//") && !match[1].startsWith("/pages/")) {
      assetRefs.add(match[1].split("?")[0]);
    }
  }
}

console.log("Total unique local asset references found across all 11 HTML pages:", assetRefs.size);
const assetList = [...assetRefs].sort();
fs.writeFileSync(path.join(__dirname, "all-asset-refs.json"), JSON.stringify(assetList, null, 2));

let existingCount = 0;
let missingCount = 0;
const missing = [];

for (const ref of assetList) {
  const absPath = path.join(PUBLIC_DIR, decodeURIComponent(ref.replace(/^\//, "")));
  if (fs.existsSync(absPath)) {
    existingCount++;
  } else {
    missingCount++;
    missing.push(ref);
  }
}

console.log(`Existing in public/: ${existingCount}, Missing: ${missingCount}`);
if (missing.length > 0) {
  console.log("Missing samples:", missing.slice(0, 10));
}
