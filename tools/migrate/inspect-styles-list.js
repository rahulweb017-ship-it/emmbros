import { execSync } from "node:child_process";
import * as cheerio from "cheerio";

const html = execSync("git show HEAD:client/public/pages/home.html", {
  maxBuffer: 15 * 1024 * 1024,
}).toString("utf8");
const $ = cheerio.load(html);

console.log("=== ALL STYLE TAGS IN HOME.HTML ===");
$("style").each((_, el) => {
  console.log($(el).attr("id") || "unnamed", "length:", $(el).text().length);
});
