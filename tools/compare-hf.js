import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, "../client/public/pages");

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".html"));
function hash(s) {
  return crypto.createHash("md5").update(s || "").digest("hex").slice(0, 10);
}
console.log("page".padEnd(30), "hdrLen", "hdrHash".padEnd(12), "ftrLen", "ftrHash");
for (const f of files) {
  const html = fs.readFileSync(path.join(DIR, f), "utf8");
  const $ = cheerio.load(html);
  const hdr = $(".ekit-template-content-header").first();
  const ftr = $(".ekit-template-content-footer").first();
  const h = hdr.length ? $.html(hdr) : "";
  const t = ftr.length ? $.html(ftr) : "";
  console.log(
    f.replace(".html", "").padEnd(30),
    String(h.length).padEnd(6),
    hash(h).padEnd(12),
    String(t.length).padEnd(6),
    hash(t)
  );
}
