import { execSync } from "node:child_process";
import * as cheerio from "cheerio";
import fs from "node:fs";

const html = execSync("git show HEAD:client/public/pages/home.html", { maxBuffer: 15 * 1024 * 1024 }).toString("utf8");
const $ = cheerio.load(html);

let kitCss = "/* Elementor Kit & Custom Inline Styles */\n";

const frontendInline = $("style#elementor-frontend-inline-css").text();
const wpCustom = $("style#wp-custom-css").text();

kitCss += "/* === elementor-frontend-inline-css === */\n" + frontendInline + "\n";
kitCss += "/* === wp-custom-css === */\n" + wpCustom + "\n";

// Also add eal aliases for all classes and vars in kitCss so both .elementor- and .eal- work!
let ealKit = kitCss
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

fs.writeFileSync("client/src/styles/kit.css", kitCss + "\n\n/* === EAL Aliases === */\n" + ealKit);
console.log("kit.css written successfully, size:", (kitCss + ealKit).length);
