import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, "../client/public");
const PAGES_DIR = path.join(PUBLIC, "pages");

const BASE = "http://localhost/emmbros";
const ORIGIN = "http://localhost";
const PREFIX = "/emmbros";

// route slug -> source path on the live site
const PAGES = [
  { slug: "home", url: `${BASE}/` },
  { slug: "who-we-are", url: `${BASE}/who-we-are/` },
  { slug: "what-we-do", url: `${BASE}/what-we-do/` },
  { slug: "product-application", url: `${BASE}/product-application/` },
  { slug: "front-axle-shaft", url: `${BASE}/product-application/front-axle-shaft/` },
  { slug: "rear-axle-shaft", url: `${BASE}/product-application/rear-axle-shaft/` },
  { slug: "gear-box-parts", url: `${BASE}/product-application/gear-box-parts/` },
  { slug: "driveline-parts", url: `${BASE}/product-application/driveline-parts/` },
  { slug: "hydraulic-parts", url: `${BASE}/product-application/hydraulic-parts/` },
  { slug: "planetary-wheel-drive-parts", url: `${BASE}/product-application/planetary-wheel-drive-parts/` },
  { slug: "career", url: `${BASE}/career/` },
];

const downloaded = new Set(); // absolute urls already handled
const failed = new Set();

function ensureDir(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
}

// map an absolute local url -> { local: "/wp-content/..", file: absFsPath } or null if not same-origin
function toLocal(absUrl) {
  try {
    const u = new URL(absUrl);
    if (u.host !== "localhost") return null;
    let p = u.pathname;
    if (p.startsWith(PREFIX + "/")) p = p.slice(PREFIX.length);
    else if (p === PREFIX) p = "/";
    if (!p.startsWith("/")) p = "/" + p;
    if (p.endsWith("/")) return null; // page, not asset
    const decoded = decodeURIComponent(p);
    return { local: p, file: path.join(PUBLIC, decoded) };
  } catch {
    return null;
  }
}

// rewrite all site-absolute references in a text blob to root-relative
function rewriteText(text) {
  return text
    .replaceAll("http:\\/\\/localhost\\/emmbros", "")
    .replaceAll("https:\\/\\/localhost\\/emmbros", "")
    .replaceAll("http://localhost/emmbros", "")
    .replaceAll("https://localhost/emmbros", "")
    .replaceAll("//localhost/emmbros", "")
    // bare root-relative paths that kept the WordPress subdirectory prefix
    .replaceAll("/emmbros/", "/")
    .replaceAll('\\/emmbros\\/', '\\/')
    // Fix cut-off header logo (use original high-res uncropped version)
    .replaceAll("/wp-content/uploads/2025/12/logo1-150x59.png", "/wp-content/uploads/2025/12/logo1.png")
    .replaceAll("wp-content/uploads/2025/12/logo1-150x59.png", "wp-content/uploads/2025/12/logo1.png");
}

async function fetchBuf(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

function extractUrlsFromCss(css, baseUrl) {
  const urls = [];
  const re = /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi;
  let m;
  while ((m = re.exec(css))) {
    const raw = m[2].trim();
    if (!raw || raw.startsWith("data:")) continue;
    try {
      urls.push(new URL(raw, baseUrl).href);
    } catch {}
  }
  const imp = /@import\s+(?:url\()?\s*(['"])([^'"]+)\1/gi;
  while ((m = imp.exec(css))) {
    try {
      urls.push(new URL(m[2], baseUrl).href);
    } catch {}
  }
  return urls;
}

async function downloadAsset(absUrl) {
  if (downloaded.has(absUrl) || failed.has(absUrl)) return;
  const loc = toLocal(absUrl);
  if (!loc) return; // third-party CDN: leave as-is
  downloaded.add(absUrl);

  const isCss = /\.css($|\?)/i.test(absUrl);
  try {
    if (isCss) {
      const css = await fetchText(absUrl);
      const nested = extractUrlsFromCss(css, absUrl);
      for (const n of nested) await downloadAsset(n);
      ensureDir(loc.file);
      fs.writeFileSync(loc.file, rewriteText(css), "utf8");
    } else {
      const buf = await fetchBuf(absUrl);
      ensureDir(loc.file);
      fs.writeFileSync(loc.file, buf);
    }
    process.stdout.write(".");
  } catch (e) {
    failed.add(absUrl);
    process.stdout.write("x");
  }
}

function collectAssetUrls($, baseUrl) {
  const set = new Set();
  const add = (raw) => {
    if (!raw) return;
    raw = raw.trim();
    if (!raw || raw.startsWith("data:") || raw.startsWith("#") || raw.startsWith("javascript:")) return;
    try {
      set.add(new URL(raw, baseUrl).href);
    } catch {}
  };
  $("link[href]").each((i, el) => add($(el).attr("href")));
  $("script[src]").each((i, el) => add($(el).attr("src")));
  $("img[src]").each((i, el) => add($(el).attr("src")));
  $("img[data-src]").each((i, el) => add($(el).attr("data-src")));
  $("source[src]").each((i, el) => add($(el).attr("src")));
  $("video[poster]").each((i, el) => add($(el).attr("poster")));
  // srcset
  $("[srcset]").each((i, el) => {
    const ss = $(el).attr("srcset") || "";
    ss.split(",").forEach((part) => add(part.trim().split(/\s+/)[0]));
  });
  $("[data-srcset]").each((i, el) => {
    const ss = $(el).attr("data-srcset") || "";
    ss.split(",").forEach((part) => add(part.trim().split(/\s+/)[0]));
  });
  // inline style url()
  $("[style]").each((i, el) => {
    extractUrlsFromCss($(el).attr("style") || "", baseUrl).forEach(add);
  });
  $("style").each((i, el) => {
    extractUrlsFromCss($(el).html() || "", baseUrl).forEach(add);
  });
  return [...set];
}

const BRIDGE = `
<script id="__emmbros_bridge">
(function(){
  function samePath(href){
    try{ var u=new URL(href, location.href); return u.origin===location.origin && !u.hash || (u.origin===location.origin && u.pathname!==location.pathname); }catch(e){ return false; }
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href]');
    if(!a) return;
    var href = a.getAttribute('href');
    if(!href) return;
    // let pure in-page anchors scroll natively inside the iframe
    if(href.charAt(0)==='#') return;
    var u;
    try{ u = new URL(href, location.href); }catch(err){ return; }
    if(u.origin!==location.origin) return; // external -> default (opens in iframe; ok)
    // internal navigation -> hand off to parent router
    if(u.pathname!==location.pathname){
      e.preventDefault();
      parent.postMessage({ __emmbros:true, type:'navigate', path:u.pathname + u.hash }, '*');
    } else if(u.hash){
      // same page hash -> scroll within iframe
      var el = document.getElementById(u.hash.slice(1));
      if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
    }
  }, true);

  // Intercept Contact Form 7 / MetForm submissions -> Node API
  document.addEventListener('submit', function(e){
    var form = e.target;
    if(!(form instanceof HTMLFormElement)) return;
    var isCf7 = form.classList.contains('wpcf7-form');
    var isMeta = form.classList.contains('metform-form') || form.querySelector('.metform-form') || form.closest('.metform-form');
    if(!isCf7 && !isMeta) return;
    e.preventDefault();
    var fd = new FormData(form);
    fd.append('__page', (location.pathname.replace('/pages/','/').replace(/\.html$/,'/')) );
    var btn = form.querySelector('[type=submit]');
    if(btn){ btn.disabled=true; }
    fetch('/api/contact', {method:'POST', body:fd})
      .then(function(r){ return r.json(); })
      .then(function(res){
        var msg = document.createElement('div');
        msg.textContent = res.ok ? 'Thank you. Your message has been sent.' : ('Error: '+(res.error||'could not send'));
        msg.style.cssText='margin-top:12px;padding:10px 14px;border-radius:6px;font-size:15px;'+(res.ok?'background:#e6f7e6;color:#1a7f37;':'background:#fdecea;color:#b3261e;');
        form.appendChild(msg);
        if(res.ok) form.reset();
      })
      .catch(function(){ alert('Submission failed. Please try again.'); })
      .finally(function(){ if(btn) btn.disabled=false; });
  }, true);

  // Parent -> iframe: scroll to an anchor after cross-page navigation
  window.addEventListener('message', function(e){
    var d = e.data;
    if(d && d.__emmbros_parent && d.type==='scroll' && d.hash){
      var el = document.getElementById(d.hash);
      if(el) setTimeout(function(){ el.scrollIntoView({behavior:'smooth'}); }, 300);
    }
  });

  // Scroll text reveal animation (reveals once on enter, never hides again)
  var style = document.createElement('style');
  style.textContent = [
    '.scroll-reveal {',
    '  opacity: 0;',
    '  transform: translateY(45px);',
    '  clip-path: inset(0 0 100% 0);',
    '  transition: opacity 0.7s ease, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), clip-path 0.85s cubic-bezier(0.16, 1, 0.3, 1);',
    '  will-change: transform, opacity, clip-path;',
    '}',
    '.scroll-reveal.revealed {',
    '  opacity: 1;',
    '  transform: translateY(0);',
    '  clip-path: inset(0 0 0 0);',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  document.addEventListener('DOMContentLoaded', function() {
    var animateElements = [].slice.call(document.querySelectorAll(
      '.elementor-widget-heading:not(.elementor-absolute):not(.elementor-fixed):not(.e-transform) .elementor-heading-title, ' +
      '.elementor-widget-text-editor:not(.elementor-absolute):not(.elementor-fixed):not(.e-transform) p, ' +
      '.elementor-widget-text-editor:not(.elementor-absolute):not(.elementor-fixed):not(.e-transform) li, ' +
      '.elementor-widget-icon-list:not(.elementor-absolute):not(.elementor-fixed):not(.e-transform) .elementor-icon-list-item, ' +
      '.elementor-widget-image:not(.elementor-absolute):not(.elementor-fixed):not(.e-transform) img, ' +
      '.elementor-widget-image-box:not(.elementor-absolute):not(.elementor-fixed):not(.e-transform) .elementor-image-box-title, ' +
      '.elementor-widget-image-box:not(.elementor-absolute):not(.elementor-fixed):not(.e-transform) .elementor-image-box-description, ' +
      '.elementor-widget-icon-box:not(.elementor-absolute):not(.elementor-fixed):not(.e-transform) .elementor-icon-box-content, ' +
      '.elementor-widget-counter:not(.elementor-absolute):not(.elementor-fixed):not(.e-transform) .elementor-counter, ' +
      '.elementor-widget-button:not(.elementor-absolute):not(.elementor-fixed):not(.e-transform) .elementor-button'
    )).filter(function(el) {
      return !el.closest('.ekit-template-content-header') && !el.closest('.ekit-template-content-footer');
    });

    // Stagger siblings slightly for a premium cascading reveal
    var parentCounts = new Map();
    animateElements.forEach(function(el) {
      var n = parentCounts.get(el.parentElement) || 0;
      el.style.transitionDelay = Math.min(n * 90, 450) + 'ms';
      parentCounts.set(el.parentElement, n + 1);
      el.classList.add('scroll-reveal');
    });

    if (typeof IntersectionObserver !== 'undefined') {
      // clip-path on a hidden target makes IntersectionObserver report zero
      // intersection, so observe each target's un-clipped parent instead.
      var watchMap = new Map();
      animateElements.forEach(function(el) {
        var w = el.parentElement || el;
        if (!watchMap.has(w)) watchMap.set(w, []);
        watchMap.get(w).push(el);
      });

      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var targets = watchMap.get(entry.target) || [];
            targets.forEach(function(t) { t.classList.add('revealed'); });
            observer.unobserve(entry.target); // reveal once, never hide again
          }
        });
      }, {
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.05
      });

      watchMap.forEach(function(_, w) {
        observer.observe(w);
      });
    } else {
      animateElements.forEach(function(el) {
        el.classList.add('revealed');
      });
    }
  });
})();
</script>
`;

// Remove PHP notice/warning/deprecated/fatal blocks leaked into the HTML
// because the source WordPress runs with display_errors = On.
function stripPhpErrors(html) {
  const styled = /<br\s*\/?>\s*<b>(?:Warning|Notice|Deprecated|Fatal error|Parse error|Strict Standards)<\/b>:[\s\S]*?on line <b>\d+<\/b>\s*<br\s*\/?>/gi;
  const plain = /<br\s*\/?>\s*(?:Warning|Notice|Deprecated|Fatal error|Parse error):[\s\S]*?on line \d+\s*<br\s*\/?>/gi;
  return html.replace(styled, "").replace(plain, "");
}

async function processPage(page) {
  console.log(`\n[page] ${page.slug} <- ${page.url}`);
  const html = await fetchText(page.url);
  const $ = cheerio.load(html, { decodeEntities: false });

  const assets = collectAssetUrls($, page.url);
  for (const a of assets) await downloadAsset(a);

  // rewrite srcset attributes (space/comma separated) to root-relative
  $("[srcset]").each((i, el) => {
    $(el).attr("srcset", rewriteText($(el).attr("srcset")));
  });

  // rewrite base href if present so relative urls resolve at site root
  $("base").remove();

  let full = $.html();
  full = rewriteText(full);
  full = stripPhpErrors(full);
  // inject SPA/form bridge before closing body
  full = full.replace(/<\/body>/i, `${BRIDGE}\n</body>`);

  fs.mkdirSync(PAGES_DIR, { recursive: true });
  fs.writeFileSync(path.join(PAGES_DIR, `${page.slug}.html`), full, "utf8");
}

// Make the header + footer on every page identical to the home page's,
// and ensure every page loads the stylesheets the header/footer need.
// The live site only enqueues some Elementor widget CSS (icon-list, spacer,
// video, wobble animation) and the Saira font on the home page, so inner
// pages render the shared header with missing styles.
function unifyHeaderFooter() {
  const homeHtml = fs.readFileSync(path.join(PAGES_DIR, "home.html"), "utf8");
  const $h = cheerio.load(homeHtml, { decodeEntities: false });
  const homeHeader = $h.html($h(".ekit-template-content-header").first());
  const homeFooter = $h.html($h(".ekit-template-content-footer").first());
  if (!homeHeader || !homeFooter) {
    console.warn("[unify] home header/footer not found, skipping");
    return;
  }
  const homeStyles = [];
  $h("head link[rel=stylesheet]").each((i, el) => {
    homeStyles.push({
      href: $h(el).attr("href"),
      id: $h(el).attr("id"),
      media: $h(el).attr("media"),
    });
  });
  const stripQuery = (u) => (u || "").split("?")[0];

  let count = 0;
  for (const p of PAGES) {
    if (p.slug === "home") continue;
    const fp = path.join(PAGES_DIR, `${p.slug}.html`);
    const $ = cheerio.load(fs.readFileSync(fp, "utf8"), { decodeEntities: false });
    const hdr = $(".ekit-template-content-header").first();
    const ftr = $(".ekit-template-content-footer").first();
    if (hdr.length) hdr.replaceWith(homeHeader);
    if (ftr.length) ftr.replaceWith(homeFooter);

    const pageHrefs = new Set();
    $("head link[rel=stylesheet]").each((i, el) => {
      pageHrefs.add(stripQuery($(el).attr("href")));
    });
    const missing = homeStyles.filter((s) => !pageHrefs.has(stripQuery(s.href)));
    if (missing.length) {
      const tags = missing
        .map((s) => {
          const idAttr = s.id ? ` id="${s.id}"` : "";
          const mediaAttr = s.media ? ` media="${s.media}"` : ' media="all"';
          return `<link rel="stylesheet"${idAttr} href="${s.href}"${mediaAttr}>`;
        })
        .join("\n");
      const lastLink = $("head link[rel=stylesheet]").last();
      if (lastLink.length) lastLink.after(`\n${tags}`);
      else $("head").append(tags);
    }

    fs.writeFileSync(fp, $.html(), "utf8");
    count++;
  }
  console.log(`[unify] applied home header/footer + assets to ${count} pages`);
}

async function main() {
  if (!process.argv.includes("--unify-only")) {
    for (const p of PAGES) {
      try {
        await processPage(p);
      } catch (e) {
        console.error(`\n[FAIL] ${p.slug}: ${e.message}`);
      }
    }
  }
  unifyHeaderFooter();
  console.log(`\n\nDone. assets downloaded: ${downloaded.size - failed.size}, failed: ${failed.size}`);
  if (failed.size) {
    fs.writeFileSync(path.join(__dirname, "failed.txt"), [...failed].join("\n"));
    console.log("failed urls written to tools/failed.txt");
  }
}

main();
