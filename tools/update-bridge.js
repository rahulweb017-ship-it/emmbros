// Swap the injected __emmbros_bridge script in already-crawled pages with the
// current BRIDGE defined in crawl.js. Useful when the WordPress source is
// offline and a full re-crawl is not possible.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.resolve(__dirname, "../client/public/pages");

const src = fs.readFileSync(path.join(__dirname, "crawl.js"), "utf8");
const m = src.match(/const BRIDGE = `([\s\S]*?)`;\s*\n/);
if (!m) throw new Error("BRIDGE template not found in crawl.js");
const bridge = m[1];

const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".html"));
let updated = 0;
for (const f of files) {
  const fp = path.join(PAGES_DIR, f);
  const html = fs.readFileSync(fp, "utf8");
  const next = html.replace(
    /<script id="__emmbros_bridge">[\s\S]*?<\/script>/,
    bridge.trim()
  );
  if (next !== html) {
    fs.writeFileSync(fp, next, "utf8");
    updated++;
  }
}
console.log(`[bridge] updated ${updated}/${files.length} pages`);
