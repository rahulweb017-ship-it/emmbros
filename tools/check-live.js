import * as cheerio from "cheerio";

const BASE = "http://localhost/emmbros";

async function fetchHtml(url) {
  const res = await fetch(url);
  return await res.text();
}

function summarize(html, label) {
  const $ = cheerio.load(html);
  const header = $(".ekit-template-content-header").first();
  const footer = $(".ekit-template-content-footer").first();

  // find elementor template post ids inside header/footer (classes like elementor-12345)
  const idRe = /elementor-(\d{3,6})/g;
  const hdrIds = new Set();
  const ftrIds = new Set();
  let m;
  const hdrHtml = $.html(header) || "";
  const ftrHtml = $.html(footer) || "";
  while ((m = idRe.exec(hdrHtml)) !== null) hdrIds.add(m[1]);
  idRe.lastIndex = 0;
  while ((m = idRe.exec(ftrHtml)) !== null) ftrIds.add(m[1]);

  const inlineCss = $("#elementor-frontend-inline-css").html() || "";
  const inlineIds = new Set();
  while ((m = idRe.exec(inlineCss)) !== null) inlineIds.add(m[1]);

  const styles = [];
  $("link[rel=stylesheet]").each((i, el) => styles.push($(el).attr("href")));

  console.log(`=== ${label} ===`);
  console.log("header html length:", hdrHtml.length);
  console.log("footer html length:", ftrHtml.length);
  console.log("header template ids:", [...hdrIds].join(", "));
  console.log("footer template ids:", [...ftrIds].join(", "));
  console.log("elementor-frontend-inline-css length:", inlineCss.length);
  console.log("template ids covered in inline css:", [...inlineIds].join(", "));
  console.log("stylesheet count:", styles.length);
  return { hdrIds, ftrIds, inlineCss, styles, hdrHtml, ftrHtml };
}

const home = summarize(await fetchHtml(`${BASE}/`), "LIVE home");
const who = summarize(await fetchHtml(`${BASE}/who-we-are/`), "LIVE who-we-are");

console.log("\n=== header identical on both pages:", home.hdrHtml === who.hdrHtml);
console.log("=== footer identical on both pages:", home.ftrHtml === who.ftrHtml);

const homeStylesSet = new Set(home.styles);
const missing = who.styles.filter((s) => !homeStylesSet.has(s));
const missingOnWho = home.styles.filter((s) => !new Set(who.styles).has(s));
console.log("\nstylesheets on home but NOT on who-we-are:");
console.log(missingOnWho.join("\n") || "(none)");

// does who-we-are inline css cover its header/footer template ids?
for (const id of [...who.hdrIds, ...who.ftrIds]) {
  console.log(`who-we-are inline css contains .elementor-${id}:`, who.inlineCss.includes(`.elementor-${id}`));
}
for (const id of [...home.hdrIds, ...home.ftrIds]) {
  console.log(`home inline css contains .elementor-${id}:`, home.inlineCss.includes(`.elementor-${id}`));
}
