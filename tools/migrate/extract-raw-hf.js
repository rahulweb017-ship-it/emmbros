import { execSync } from "node:child_process";
import * as cheerio from "cheerio";
import fs from "node:fs";

const html = execSync("git show HEAD:client/public/pages/home.html", { maxBuffer: 15 * 1024 * 1024 }).toString("utf8");
const $ = cheerio.load(html);

const headerHtml = $(".ekit-template-content-header").prop("outerHTML");
const footerHtml = $(".ekit-template-content-footer").prop("outerHTML");

fs.writeFileSync("tools/migrate/raw-header.html", headerHtml);
fs.writeFileSync("tools/migrate/raw-footer.html", footerHtml);

console.log("Saved raw-header.html (bytes):", headerHtml?.length);
console.log("Saved raw-footer.html (bytes):", footerHtml?.length);
