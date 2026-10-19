import fs from "node:fs";

function processCss(raw) {
  let eal = raw
    .replace(/\.elementor-([a-zA-Z0-9_-]+)/g, ".eal-$1")
    .replace(/\.elementor\b/g, ".eal-page")
    .replace(/\.ekit-([a-zA-Z0-9_-]+)/g, ".eal-kit-$1")
    .replace(/\.e-con-boxed\b/g, ".eal-con-boxed")
    .replace(/\.e-con-full\b/g, ".eal-con-full")
    .replace(/\.e-con-inner\b/g, ".eal-con-inner")
    .replace(/\.e-con\b/g, ".eal-con")
    .replace(/\.e-flex\b/g, ".eal-flex")
    .replace(/\.e-parent\b/g, ".eal-parent")
    .replace(/\.e-child\b/g, ".eal-child")
    .replace(/--e-/g, "--eal-");
  return raw + "\n\n/* === EAL Aliases === */\n" + eal;
}

const headerRaw = fs.readFileSync("tools/migrate/header-style-0.css", "utf8");
const footerRaw = fs.readFileSync("tools/migrate/footer-style-0.css", "utf8");

fs.mkdirSync("client/src/styles/components", { recursive: true });
fs.writeFileSync("client/src/styles/components/header.css", processCss(headerRaw));
fs.writeFileSync("client/src/styles/components/footer.css", processCss(footerRaw));

console.log("header.css and footer.css generated successfully!");
