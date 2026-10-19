import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const map = JSON.parse(fs.readFileSync("tools/migrate/asset-copy-map.json", "utf8"));

function htmlToJsx(htmlStr) {
  let s = htmlStr;
  for (const [orig, item] of Object.entries(map)) {
    if (s.includes(orig)) {
      s = s.replaceAll(orig, item.targetRel);
    }
  }

  // Self close void tags
  s = s.replace(/<(img|input|br|hr)([^>]*?)(?<!\/)>/gi, "<$1$2 />");

  // Attribute conversions
  s = s.replace(/\bclass=/g, "className=");
  s = s.replace(/\bfor=/g, "htmlFor=");
  s = s.replace(/\btabindex=/g, "tabIndex=");
  s = s.replace(/\bautocomplete=/g, "autoComplete=");
  s = s.replace(/\bclip-path=/g, "clipPath=");
  s = s.replace(/\bfill-rule=/g, "fillRule=");
  s = s.replace(/\bclip-rule=/g, "clipRule=");
  s = s.replace(/\bstroke-width=/g, "strokeWidth=");
  s = s.replace(/\bstroke-linecap=/g, "strokeLinecap=");
  s = s.replace(/\bstroke-linejoin=/g, "strokeLinejoin=");

  // Inline styles to style={{...}}
  s = s.replace(/style="([^"]*)"/g, (m, val) => {
    const rules = val.split(";").map(r => r.trim()).filter(Boolean);
    const obj = {};
    for (const r of rules) {
      const idx = r.indexOf(":");
      if (idx === -1) continue;
      const prop = r.slice(0, idx).trim();
      const value = r.slice(idx + 1).trim();
      let jsProp = prop;
      if (!prop.startsWith("--")) {
        jsProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      }
      obj[jsProp] = value;
    }
    return `style={${JSON.stringify(obj)}}`;
  });

  return s;
}

// 1. Process Header
const rawHeader = fs.readFileSync("tools/migrate/raw-header.html", "utf8");
const $hdr = cheerio.load(rawHeader);
$hdr("style").remove();
const headerJsx = htmlToJsx($hdr.html().trim());
fs.writeFileSync("tools/migrate/header-jsx-body.txt", headerJsx);
console.log("Header JSX body generated, length:", headerJsx.length);

// 2. Process Footer
const rawFooter = fs.readFileSync("tools/migrate/raw-footer.html", "utf8");
const $ftr = cheerio.load(rawFooter);
$ftr("style").remove();
const footerJsx = htmlToJsx($ftr.html().trim());
fs.writeFileSync("tools/migrate/footer-jsx-body.txt", footerJsx);
console.log("Footer JSX body generated, length:", footerJsx.length);
