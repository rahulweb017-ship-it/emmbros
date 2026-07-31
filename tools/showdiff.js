import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, "../client/public/pages");
const A = process.argv[2] || "home";
const B = process.argv[3] || "who-we-are";

function hdr(file) {
  const $ = cheerio.load(fs.readFileSync(path.join(DIR, file + ".html"), "utf8"));
  return $.html($(".ekit-template-content-header").first());
}
const a = hdr(A);
const b = hdr(B);

// token diff on tag boundaries
const ta = a.split(/(?=<)/);
const tb = b.split(/(?=<)/);
let shown = 0;
const max = Math.max(ta.length, tb.length);
for (let i = 0; i < max && shown < 15; i++) {
  if (ta[i] !== tb[i]) {
    console.log(`--- idx ${i} ---`);
    console.log(`  ${A}: ${JSON.stringify((ta[i] || "").slice(0, 160))}`);
    console.log(`  ${B}: ${JSON.stringify((tb[i] || "").slice(0, 160))}`);
    shown++;
  }
}
console.log(`\ntokens: ${A}=${ta.length} ${B}=${tb.length}, diffs shown=${shown}`);
