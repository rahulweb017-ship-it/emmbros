import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = path.resolve(__dirname, "../../client/public/pages");

const homeHtml = fs.readFileSync(path.join(PAGES_DIR, "home.html"), "utf8");
const $home = cheerio.load(homeHtml);

const headerHtml = $home(".ekit-template-content-header").html();
const footerHtml = $home(".ekit-template-content-footer").html();

console.log("Header length in home.html:", headerHtml?.length);
console.log("Footer length in home.html:", footerHtml?.length);

for (const f of fs.readdirSync(PAGES_DIR)) {
  const html = fs.readFileSync(path.join(PAGES_DIR, f), "utf8");
  const $ = cheerio.load(html);
  const h = $(".ekit-template-content-header").html();
  const foo = $(".ekit-template-content-footer").html();
  console.log(f, "header match:", h === headerHtml, "footer match:", foo === footerHtml, "page classes:", $("div.elementor").map((_, e) => $(e).attr("class")).get().filter(c => !c.includes("header") && !c.includes("footer")).join(" | "));
}
