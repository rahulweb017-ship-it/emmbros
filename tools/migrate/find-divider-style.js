import { execSync } from "node:child_process";
import * as cheerio from "cheerio";

const html = execSync("git show HEAD:client/public/pages/home.html", { maxBuffer: 15 * 1024 * 1024 }).toString("utf8");
const $ = cheerio.load(html);

$("style").each((_, el) => {
  const txt = $(el).text();
  if (txt.includes("2094b03")) {
    console.log("Style ID:", $(el).attr("id"));
    const matches = txt.match(/([^{}]+{[^{}]+})/g) || [];
    for (const m of matches) {
      if (m.includes("2094b03")) console.log("->", m);
    }
  }
});
