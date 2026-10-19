import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(__dirname, "../../client/src");

function cleanJsxMarkup(content) {
  let s = content;

  // 1. Remove all Elementor metadata data attributes
  s = s.replace(/\s+data-elementor-[a-z0-9_-]+="[^"]*"/gi, "");
  s = s.replace(/\s+data-elementor-[a-z0-9_-]+/gi, "");
  s = s.replace(/\s+data-id="[^"]*"/gi, "");
  s = s.replace(/\s+data-element_type="[^"]*"/gi, "");
  s = s.replace(/\s+data-widget_type="[^"]*"/gi, "");
  s = s.replace(/\s+data-settings="[^"]*"/gi, "");
  s = s.replace(/\s+data-e-type="[^"]*"/gi, "");
  s = s.replace(/\s+data-e-action-hash="[^"]*"/gi, "");
  s = s.replace(/\s+data-wpcf7-id="[^"]*"/gi, "");
  s = s.replace(/\s+data-status="[^"]*"/gi, "");
  s = s.replace(/\s+data-name="[^"]*"/gi, "");
  s = s.replace(/\s+data-start="[^"]*"/gi, "");
  s = s.replace(/\s+data-end="[^"]*"/gi, "");
  s = s.replace(/\s+data-section-id="[^"]*"/gi, "");

  // 2. Rename elementor and ekit classes to eal-*
  s = s.replace(/\belementor-([a-zA-Z0-9_-]+)/g, "eal-$1");
  s = s.replace(/\belementor\b/g, "eal-page");
  s = s.replace(/\bekit-([a-zA-Z0-9_-]+)/g, "eal-kit-$1");
  s = s.replace(/\be-con-boxed\b/g, "eal-con-boxed");
  s = s.replace(/\be-con-full\b/g, "eal-con-full");
  s = s.replace(/\be-con-inner\b/g, "eal-con-inner");
  s = s.replace(/\be-con\b/g, "eal-con");
  s = s.replace(/\be-flex\b/g, "eal-flex");
  s = s.replace(/\be-parent\b/g, "eal-parent");
  s = s.replace(/\be-child\b/g, "eal-child");
  s = s.replace(/\be-font-icon-svg\b/g, "eal-icon-svg");
  s = s.replace(/\be-eicon-play\b/g, "eal-icon-play");

  return s;
}

function cleanCssStyles(content) {
  let s = content;

  // Replace class selectors
  s = s.replace(/\.elementor-([a-zA-Z0-9_-]+)/g, ".eal-$1");
  s = s.replace(/\.elementor\b/g, ".eal-page");
  s = s.replace(/\.ekit-([a-zA-Z0-9_-]+)/g, ".eal-kit-$1");
  s = s.replace(/\.e-con-boxed\b/g, ".eal-con-boxed");
  s = s.replace(/\.e-con-full\b/g, ".eal-con-full");
  s = s.replace(/\.e-con-inner\b/g, ".eal-con-inner");
  s = s.replace(/\.e-con\b/g, ".eal-con");
  s = s.replace(/\.e-flex\b/g, ".eal-flex");
  s = s.replace(/\.e-parent\b/g, ".eal-parent");
  s = s.replace(/\.e-child\b/g, ".eal-child");
  s = s.replace(/\.e-font-icon-svg\b/g, ".eal-icon-svg");
  s = s.replace(/\.e-eicon-play\b/g, ".eal-icon-play");

  // Remove elementor css custom property names where appropriate or keep them mapped
  s = s.replace(/--elementor-/g, "--eal-");
  s = s.replace(/--e-/g, "--eal-");

  return s;
}

// 1. Process all pages
const pagesDir = path.join(SRC_DIR, "pages");
function walkAndCleanJsx(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      walkAndCleanJsx(full);
    } else if (item.endsWith(".jsx")) {
      const orig = fs.readFileSync(full, "utf8");
      const cleaned = cleanJsxMarkup(orig);
      fs.writeFileSync(full, cleaned);
      console.log(`Cleaned JSX: ${item}`);
    }
  }
}
walkAndCleanJsx(pagesDir);

// 2. Process all stylesheets
const stylesDir = path.join(SRC_DIR, "styles");
function walkAndCleanCss(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      walkAndCleanCss(full);
    } else if (item.endsWith(".css")) {
      const orig = fs.readFileSync(full, "utf8");
      const cleaned = cleanCssStyles(orig);
      fs.writeFileSync(full, cleaned);
      console.log(`Cleaned CSS: ${item}`);
    }
  }
}
walkAndCleanCss(stylesDir);

console.log("Elementor dependency and class sanitization complete!");
