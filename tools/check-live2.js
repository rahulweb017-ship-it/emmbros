import * as cheerio from "cheerio";

const BASE = "http://localhost/emmbros";

async function fetchHtml(url) {
  const res = await fetch(url);
  return await res.text();
}

function analyze(html, label) {
  const $ = cheerio.load(html);
  console.log(`=== ${label} ===`);

  $("style").each((i, el) => {
    const id = $(el).attr("id") || "no-id";
    const css = $(el).html() || "";
    const has14433 = css.includes("14433");
    const has14451 = css.includes("14451");
    if (has14433 || has14451 || id === "no-id") {
      console.log(`style id=${id} len=${css.length} has14433=${has14433} has14451=${has14451}`);
    }
  });

  $("link").each((i, el) => {
    const href = $(el).attr("href") || "";
    if (href.includes("14433") || href.includes("14451") || href.includes("elementor/css") || href.includes("elementskit")) {
      console.log(`link rel=${$(el).attr("rel")} href=${href}`);
    }
  });

  // scripts referencing template css?
  const m = html.match(/post-14433\.css[^"']*/g);
  console.log("post-14433.css refs:", m ? m.slice(0, 3).join(" | ") : "(none)");
  const m2 = html.match(/post-14451\.css[^"']*/g);
  console.log("post-14451.css refs:", m2 ? m2.slice(0, 3).join(" | ") : "(none)");
}

const home = await fetchHtml(`${BASE}/`);
analyze(home, "LIVE home");
const who = await fetchHtml(`${BASE}/who-we-are/`);
analyze(who, "LIVE who-we-are");
