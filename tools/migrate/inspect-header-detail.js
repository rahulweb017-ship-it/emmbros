import fs from "node:fs";
import * as cheerio from "cheerio";

const html = fs.readFileSync("tools/migrate/raw-header.html", "utf8");
const $ = cheerio.load(html);

console.log("Style tags in header:", $("style").length);
$("style").each((i, el) => {
  console.log(`Header style ${i} length:`, $(el).text().length);
  fs.writeFileSync(`tools/migrate/header-style-${i}.css`, $(el).text());
});

$("style").remove();
console.log("Header HTML without style tag:\n");
console.log($.html());
