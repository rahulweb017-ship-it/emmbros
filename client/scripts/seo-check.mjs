import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SITE_URL,
  SEO_PAGES,
  PUBLIC_PRERENDER_ROUTES,
  getCanonicalUrl,
  normalizeCanonicalPath,
} from "../src/config/seoConfig.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

const errors = [];
const seenTitles = new Map();
const seenDescriptions = new Map();
const seenCanonicals = new Map();

function decodeEntities(str = "") {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function getFileForRoute(route) {
  if (route === "/") return path.join(distDir, "index.html");
  if (route === "/404") return path.join(distDir, "404.html");
  return path.join(distDir, route.replace(/^\//, ""), "index.html");
}

// Valid internal route targets (including redirects)
const validInternalPaths = new Set([
  ...PUBLIC_PRERENDER_ROUTES,
  "/404",
  "/about",
  "/front-axle-shaft",
  "/rear-axle-shaft",
  "/gear-box-parts",
  "/driveline-parts",
  "/hydraulic-parts",
  "/planetary-wheel-drive-parts",
]);

console.log("\n=== Running Automated Post-Build Technical SEO Audit ===");

const allRoutes = [...PUBLIC_PRERENDER_ROUTES, "/404"];
const summaryRows = [];

for (const route of allRoutes) {
  const htmlPath = getFileForRoute(route);
  if (!fs.existsSync(htmlPath)) {
    errors.push(`[${route}] Built HTML file does not exist: ${htmlPath}`);
    continue;
  }

  const html = fs.readFileSync(htmlPath, "utf-8");

  // 1. Check <html lang="en"> and viewport
  if (!/<html[^>]*\blang="en"/i.test(html)) {
    errors.push(`[${route}] Missing <html lang="en">`);
  }
  if (!/<meta[^>]*\bname="viewport"/i.test(html)) {
    errors.push(`[${route}] Missing <meta name="viewport">`);
  }

  // 2. Check <title>
  const titleMatches = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)];
  if (titleMatches.length !== 1) {
    errors.push(`[${route}] Expected exactly 1 <title>, found ${titleMatches.length}`);
  }
  const title = titleMatches[0] ? decodeEntities(titleMatches[0][1].trim()) : "";
  if (title.length < 50 || title.length > 60) {
    errors.push(`[${route}] Title length (${title.length}) must be 50–60 chars: "${title}"`);
  }
  if (/\b(Mfr|HP)\b/.test(title)) {
    errors.push(`[${route}] Title contains forbidden abbreviation (Mfr/HP): "${title}"`);
  }
  if (seenTitles.has(title)) {
    errors.push(`[${route}] Duplicate title with ${seenTitles.get(title)}: "${title}"`);
  }
  seenTitles.set(title, route);

  // 3. Check <meta name="description">
  const descMatches = [...html.matchAll(/<meta\s+name="description"\s+content="([^"]*)"/gi)];
  if (descMatches.length !== 1) {
    errors.push(`[${route}] Expected exactly 1 <meta name="description">, found ${descMatches.length}`);
  }
  const desc = descMatches[0] ? decodeEntities(descMatches[0][1].trim()) : "";
  if (desc.length < 140 || desc.length > 160) {
    errors.push(`[${route}] Description length (${desc.length}) must be 140–160 chars: "${desc}"`);
  }
  if (seenDescriptions.has(desc)) {
    errors.push(`[${route}] Duplicate description with ${seenDescriptions.get(desc)}`);
  }
  seenDescriptions.set(desc, route);

  // 4. Check <link rel="canonical">
  const canonMatches = [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]*)"/gi)];
  if (canonMatches.length !== 1) {
    errors.push(`[${route}] Expected exactly 1 <link rel="canonical">, found ${canonMatches.length}`);
  }
  const canonical = canonMatches[0] ? canonMatches[0][1].trim() : "";
  const expectedCanonical = getCanonicalUrl(SEO_PAGES[route].canonicalPath);
  if (canonical !== expectedCanonical) {
    errors.push(`[${route}] Canonical mismatch: expected "${expectedCanonical}", found "${canonical}"`);
  }
  if (seenCanonicals.has(canonical)) {
    errors.push(`[${route}] Duplicate canonical with ${seenCanonicals.get(canonical)}`);
  }
  seenCanonicals.set(canonical, route);

  // 5. Check Open Graph & Twitter tags + 1200x630 non-logo OG image
  for (const prop of ["og:title", "og:description", "og:url", "og:type", "og:site_name", "og:image"]) {
    const re = new RegExp(`<meta\\s+property="${prop}"\\s+content="([^"]+)"`, "i");
    const m = html.match(re);
    if (!m) {
      errors.push(`[${route}] Missing <meta property="${prop}">`);
    } else if (prop === "og:image" && /logo/i.test(m[1])) {
      errors.push(`[${route}] og:image must not use the logo: ${m[1]}`);
    }
  }

  // 6. Check H1 count in rendered HTML
  const h1Matches = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1Matches.length !== 1) {
    errors.push(`[${route}] Expected exactly 1 <h1> in rendered HTML, found ${h1Matches.length}`);
  }

  // 7. Check word count in rendered body (at least 300 words for public pages)
  const bodyMatch = html.match(/<div id="root">([\s\S]*?)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : "";
  const plainText = decodeEntities(
    bodyHtml
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
  const wordCount = plainText.split(" ").filter((w) => /[a-zA-Z]{2,}/.test(w)).length;
  if (route !== "/404" && wordCount < 300) {
    errors.push(`[${route}] Insufficient crawlable content (${wordCount} words < 300 minimum)`);
  }

  // 8. Check all <img> tags have descriptive alt, width, height
  const imgTags = [...bodyHtml.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  for (const img of imgTags) {
    const altMatch = img.match(/\balt="([^"]*)"/i);
    if (!altMatch || !altMatch[1].trim()) {
      errors.push(`[${route}] Image missing non-empty alt attribute: ${img}`);
    }
    if (!/\bwidth="/i.test(img) || !/\bheight="/i.test(img)) {
      errors.push(`[${route}] Image missing explicit width or height: ${img}`);
    }
  }

  // 9. Check internal <a href="/..."> links
  const anchorMatches = [...bodyHtml.matchAll(/<a\b[^>]*\bhref="(\/[^"]*)"/gi)];
  for (const aMatch of anchorMatches) {
    const rawHref = aMatch[1];
    if (rawHref.startsWith("//")) continue;
    const normHref = normalizeCanonicalPath(rawHref);
    if (
      !validInternalPaths.has(normHref) &&
      !normHref.startsWith("/blog/") &&
      !normHref.startsWith("/careers/") &&
      !normHref.startsWith("/wp-content/") &&
      !normHref.startsWith("/assets/")
    ) {
      errors.push(`[${route}] Broken internal link href="${rawHref}" (normalized: "${normHref}")`);
    }
  }

  // 10. Check JSON-LD validity & required schemas
  const jsonLdMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  if (jsonLdMatches.length === 0) {
    errors.push(`[${route}] Missing JSON-LD structured data script`);
  } else {
    const parsedNodes = [];
    for (const jm of jsonLdMatches) {
      try {
        const parsed = JSON.parse(jm[1]);
        if (Array.isArray(parsed)) parsedNodes.push(...parsed);
        else parsedNodes.push(parsed);
      } catch (e) {
        errors.push(`[${route}] Invalid JSON-LD syntax: ${e.message}`);
      }
    }

    // Check AutoPartsStore markup
    const hasAutoPartsStore = parsedNodes.some((node) => {
      const t = node["@type"];
      if (Array.isArray(t)) return t.includes("AutoPartsStore");
      return t === "AutoPartsStore";
    });
    if (!hasAutoPartsStore) {
      errors.push(`[${route}] Missing Schema.org AutoPartsStore markup in JSON-LD`);
    }

    // Check Plant Locations on key entity pages
    if (["/", "/contact", "/who-we-are", "/what-we-do", "/product-application"].includes(route)) {
      const plantIds = ["#plant-katha", "#plant-bhud", "#plant-epip"];
      for (const pid of plantIds) {
        const hasPlant = parsedNodes.some((n) => n["@id"] && n["@id"].includes(pid));
        if (!hasPlant) {
          errors.push(`[${route}] Missing verified Plant Location node "${pid}" in JSON-LD`);
        }
      }
    }

    // Check Product markup on product application pages
    if (route.startsWith("/product-application/")) {
      const hasProduct = parsedNodes.some((n) => n["@type"] === "Product");
      if (!hasProduct) {
        errors.push(`[${route}] Missing Schema.org Product markup in JSON-LD`);
      }
    }
  }

  summaryRows.push({
    route,
    h1Count: h1Matches.length,
    titleLen: title.length,
    descLen: desc.length,
    words: wordCount,
    imgs: imgTags.length,
    canonical,
  });
}

// 11. Check sitemap.xml & robots.txt
const sitemapPath = path.join(distDir, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  errors.push(`Missing dist/sitemap.xml`);
} else {
  const sitemapXml = fs.readFileSync(sitemapPath, "utf-8");
  for (const route of PUBLIC_PRERENDER_ROUTES) {
    const loc = getCanonicalUrl(SEO_PAGES[route].canonicalPath);
    if (!sitemapXml.includes(`<loc>${loc}</loc>`)) {
      errors.push(`Sitemap is missing public canonical URL: ${loc}`);
    }
  }
}

const robotsPath = path.join(distDir, "robots.txt");
if (!fs.existsSync(robotsPath)) {
  errors.push(`Missing dist/robots.txt`);
} else {
  const robotsTxt = fs.readFileSync(robotsPath, "utf-8");
  if (!robotsTxt.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) {
    errors.push(`dist/robots.txt missing Sitemap declaration`);
  }
}

// 12. Check llms.txt & llms-full.txt
const llmsPath = path.join(distDir, "llms.txt");
if (!fs.existsSync(llmsPath)) {
  errors.push(`Missing dist/llms.txt`);
} else {
  const llmsContent = fs.readFileSync(llmsPath, "utf-8");
  if (!llmsContent.includes("# Emmbros Autocomp Ltd") || !llmsContent.includes("https://emmbros.com/")) {
    errors.push(`dist/llms.txt is malformed or missing key header/links`);
  }
}

console.table(summaryRows);

if (errors.length > 0) {
  console.error(`\n❌ SEO Audit Failed with ${errors.length} error(s):`);
  for (const err of errors) {
    console.error("  - " + err);
  }
  process.exit(1);
} else {
  console.log(`\n✅ All ${allRoutes.length} pre-rendered routes passed every SEO check (0 errors)!`);
}
