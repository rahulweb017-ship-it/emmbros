import { execSync } from "node:child_process";
import * as cheerio from "cheerio";

const html = execSync("git show HEAD:client/public/pages/home.html", { maxBuffer: 15 * 1024 * 1024 }).toString("utf8");
const $ = cheerio.load(html);

console.log("=== HEADER HTML SNIPPET ===");
console.log($(".ekit-template-content-header").prop("outerHTML")?.slice(0, 2000));

console.log("\n=== FOOTER HTML SNIPPET ===");
console.log($(".ekit-template-content-footer").prop("outerHTML")?.slice(0, 2000));
