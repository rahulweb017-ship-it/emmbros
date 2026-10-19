import { execSync } from "node:child_process";
import * as cheerio from "cheerio";

const html = execSync("git show HEAD:client/public/pages/home.html", { maxBuffer: 15 * 1024 * 1024 }).toString("utf8");
const $ = cheerio.load(html);

console.log("=== FIRST SECTION OF HOME ===");
const main = $("body").children().not(".ekit-template-content-header, .ekit-template-content-footer, script, style");
main.slice(0, 3).each((i, el) => {
  console.log(`Section ${i}:`, el.tagName, $(el).attr("class"));
  console.log($(el).html()?.slice(0, 500));
  console.log("-------------------");
});
