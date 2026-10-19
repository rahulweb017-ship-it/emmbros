import { execSync } from "node:child_process";
import fs from "node:fs";

const html = execSync("git show HEAD:client/public/pages/home.html", { maxBuffer: 15 * 1024 * 1024 }).toString("utf8");

function findSelectors(sel) {
  const cleanSel = sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const reg = new RegExp(cleanSel + "[^{]*\\{[^}]*\\}", "g");
  return html.match(reg) || [];
}

console.log("=== custom-btn ===");
console.log(findSelectors(".custom-btn"));

console.log("=== .eal-element-89db8ac (product section) ===");
console.log(findSelectors(".eal-element-89db8ac"));

console.log("=== .eal-element-2094b03 (divider) ===");
console.log(findSelectors(".eal-element-2094b03"));

console.log("=== video section around Engineering Excellence ===");
const vidIdx = html.indexOf("Engineering Excellence");
if (vidIdx !== -1) {
  console.log(html.slice(vidIdx, vidIdx + 1500));
}

console.log("=== Built for Every Demanding Sector ===");
const secIdx = html.indexOf("Demanding Sector");
if (secIdx !== -1) {
  console.log(html.slice(secIdx - 300, secIdx + 300));
}
