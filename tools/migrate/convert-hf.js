import fs from "node:fs";
import * as cheerio from "cheerio";

const map = JSON.parse(fs.readFileSync("tools/migrate/asset-copy-map.json", "utf8"));

function sanitize(htmlStr) {
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

// 1. Convert Header
const rawHdr = fs.readFileSync("tools/migrate/raw-header.html", "utf8");
const $hdr = cheerio.load(rawHdr);
$hdr("style").remove();
$hdr("script").remove();

// Replace a links with react Link where appropriate, or keep href
let hdrBody = sanitize($hdr(".ekit-template-content-header").prop("outerHTML") || $hdr.html());

const headerComponent = `import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/components/header.css";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="site-header-root" style={{ position: "sticky", top: 0, zIndex: 1000, background: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      ${hdrBody}
    </header>
  );
}
`;

fs.writeFileSync("client/src/components/layout/Header.jsx", headerComponent);
console.log("Generated client/src/components/layout/Header.jsx");

// 2. Convert Footer
const rawFtr = fs.readFileSync("tools/migrate/raw-footer.html", "utf8");
const $ftr = cheerio.load(rawFtr);
$ftr("style").remove();
$ftr("script").remove();

let ftrBody = sanitize($ftr(".ekit-template-content-footer").prop("outerHTML") || $ftr.html());

const footerComponent = `import React from "react";
import { Link } from "react-router-dom";
import "../../styles/components/footer.css";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer-root">
      ${ftrBody}
    </footer>
  );
}
`;

fs.writeFileSync("client/src/components/layout/Footer.jsx", footerComponent);
console.log("Generated client/src/components/layout/Footer.jsx");
