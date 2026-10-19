import fs from "node:fs";

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
  s = s.replace(/\s+data-vertical-menu="[^"]*"/gi, "");
  s = s.replace(/\s+data-hamburger-icon="[^"]*"/gi, "");
  s = s.replace(/\s+data-hamburger-icon-type="[^"]*"/gi, "");
  s = s.replace(/\s+data-responsive-breakpoint="[^"]*"/gi, "");
  s = s.replace(/\s+data-close-on-anchor="[^"]*"/gi, "");

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
  s = s.replace(/\be-grid-align-center\b/g, "eal-grid-align-center");

  return s;
}

const hdr = fs.readFileSync("client/src/components/layout/Header.jsx", "utf8");
fs.writeFileSync("client/src/components/layout/Header.jsx", cleanJsxMarkup(hdr));
console.log("Sanitized Header.jsx");

const ftr = fs.readFileSync("client/src/components/layout/Footer.jsx", "utf8");
fs.writeFileSync("client/src/components/layout/Footer.jsx", cleanJsxMarkup(ftr));
console.log("Sanitized Footer.jsx");
