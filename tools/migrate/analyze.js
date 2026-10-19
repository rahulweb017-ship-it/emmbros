import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.resolve(__dirname, "../../client/public/pages");

const widgets = {};
const scripts = new Set();
const styles = new Set();
const forms = [];
const iframes = [];
const settingsKeys = {};
for (const f of fs.readdirSync(PAGES_DIR)) {
  const html = fs.readFileSync(path.join(PAGES_DIR, f), "utf8");
  const $ = cheerio.load(html);
  $("[data-widget_type]").each((_, el) => {
    const t = $(el).attr("data-widget_type");
    widgets[t] = widgets[t] || new Set();
    widgets[t].add(f);
  });
  $("script[src]").each((_, el) => scripts.add($(el).attr("src")));
  $("link[rel=stylesheet]").each((_, el) => styles.add($(el).attr("href")));
  $("form").each((_, el) => forms.push(`${f}: class=${$(el).attr("class")} action=${$(el).attr("action")}`));
  $("iframe").each((_, el) => iframes.push(`${f}: ${$(el).attr("src") || $(el).attr("data-src")}`));
  $("[data-settings]").each((_, el) => {
    try {
      const s = JSON.parse($(el).attr("data-settings"));
      for (const k of Object.keys(s)) {
        settingsKeys[k] = (settingsKeys[k] || 0) + 1;
      }
    } catch {}
  });
  const inline = $("script:not([src])").map((_, el) => ($(el).attr("id") || "") + ":" + $(el).html().slice(0, 80).replace(/\s+/g, " ")).get();
  console.log("\n==", f, "inline scripts:", inline.length);
  inline.forEach((s) => console.log("   ", s));
  console.log("   body class:", $("body").attr("class"));
  console.log("   body children:", $("body").children().map((_, e) => e.tagName + "." + ($(e).attr("class") || "").split(" ").slice(0, 3).join(".") + "#" + ($(e).attr("id") || "")).get().join(" | "));
}
console.log("\n== WIDGETS");
for (const [k, v] of Object.entries(widgets)) console.log(k, [...v].length);
console.log("\n== SCRIPTS");
[...scripts].forEach((s) => console.log(s));
console.log("\n== STYLES");
[...styles].forEach((s) => console.log(s));
console.log("\n== FORMS");
forms.forEach((s) => console.log(s));
console.log("\n== IFRAMES");
iframes.forEach((s) => console.log(s));
console.log("\n== SETTINGS KEYS");
console.log(JSON.stringify(settingsKeys));
