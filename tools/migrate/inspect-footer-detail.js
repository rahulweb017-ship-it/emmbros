import fs from "node:fs";
import * as cheerio from "cheerio";

const html = fs.readFileSync("tools/migrate/raw-footer.html", "utf8");
const $ = cheerio.load(html);

console.log("Style tags in footer:", $("style").length);
$("style").each((i, el) => {
  console.log(`Style ${i} length:`, $(el).text().length);
  fs.writeFileSync(`tools/migrate/footer-style-${i}.css`, $(el).text());
});

$("style").remove();
console.log("Footer HTML without style tag:\n");
console.log($.html());
