import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, "../client/public/pages");
const hash = (s) => crypto.createHash("md5").update(s || "").digest("hex").slice(0, 10);

function headerOf(file) {
  const $ = cheerio.load(fs.readFileSync(path.join(DIR, file), "utf8"));
  return { $, el: $(".ekit-template-content-header").first() };
}

// Normalize: strip menu active-state classes/attrs that WordPress injects per page.
function normalize(file) {
  const { $, el } = headerOf(file);
  el.find("li").each((i, li) => {
    const cls = ($(li).attr("class") || "")
      .split(/\s+/)
      .filter((c) => !/^(current[-_]|current_page|menu-item-has-children)/.test(c) && !/current/.test(c))
      .join(" ");
    $(li).attr("class", cls);
  });
  el.find("a[aria-current]").removeAttr("aria-current");
  return $.html(el);
}

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".html"));
console.log("Normalized header hashes (active-menu state removed):");
const hashes = {};
for (const f of files) {
  const h = hash(normalize(f));
  hashes[h] = (hashes[h] || []).concat(f.replace(".html", ""));
  console.log(f.replace(".html", "").padEnd(30), h);
}
console.log("\nDistinct normalized header variants:", Object.keys(hashes).length);
for (const [h, list] of Object.entries(hashes)) console.log("  ", h, "->", list.join(", "));
