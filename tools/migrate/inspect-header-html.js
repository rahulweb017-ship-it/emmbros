import fs from "node:fs";
import * as cheerio from "cheerio";

const html = fs.readFileSync("client/public/pages/home.html", "utf8");
const $ = cheerio.load(html);
const header = $(".ekit-template-content-header");

console.log("Header outerHTML snippet:");
console.log(header.html().slice(0, 3000));
