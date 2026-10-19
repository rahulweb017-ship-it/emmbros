import fs from "node:fs";
import * as cheerio from "cheerio";

const html = fs.readFileSync("tools/migrate/raw-header.html", "utf8");
const $ = cheerio.load(html);
console.log($(".elementor-element-5db44bf").html());
