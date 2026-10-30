import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(__dirname, "..");
const distDir = path.join(clientRoot, "dist");
const ssrDir = path.join(clientRoot, "dist-ssr");

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function runPrerender() {
  const templatePath = path.join(distDir, "index.html");
  if (!fs.existsSync(templatePath)) {
    throw new Error(`dist/index.html not found at ${templatePath}. Run "vite build" first.`);
  }

  const templateHtml = fs.readFileSync(templatePath, "utf-8");

  // Save a clean SPA shell for dynamic CMS routes (/blog/:slug, /careers/:slug, /admin/*)
  fs.writeFileSync(path.join(distDir, "_spa_shell.html"), templateHtml, "utf-8");

  // Find the compiled SSR entry
  const ssrEntryPath = fs.existsSync(path.join(ssrDir, "entry-server.js"))
    ? path.join(ssrDir, "entry-server.js")
    : path.join(ssrDir, "entry-server.mjs");

  const {
    render,
    SITE_URL,
    SITE_NAME,
    SEO_PAGES,
    PUBLIC_PRERENDER_ROUTES,
    getCanonicalUrl,
    buildPageJsonLd,
  } = await import(pathToFileURL(ssrEntryPath).href);

  const allRoutes = [...PUBLIC_PRERENDER_ROUTES, "/404"];

  for (const route of allRoutes) {
    const cfg = SEO_PAGES[route];
    if (!cfg || !cfg.title || !cfg.description || !cfg.canonicalPath) {
      throw new Error(`[Prerender Error] Missing SEO metadata in seoConfig.js for route: ${route}`);
    }

    const { appHtml } = render(route === "/404" ? "/404-not-found-page" : route);
    const canonicalUrl = getCanonicalUrl(cfg.canonicalPath);
    const ogImageUrl = cfg.ogImage.startsWith("http") ? cfg.ogImage : `${SITE_URL}${cfg.ogImage}`;
    const jsonLdGraph = buildPageJsonLd(route);

    const seoHeadBlock = [
      `<title>${escapeHtml(cfg.title)}</title>`,
      `<meta name="description" content="${escapeHtml(cfg.description)}" />`,
      `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
      `<meta name="robots" content="${escapeHtml(cfg.robots || "index, follow")}" />`,
      `<meta property="og:title" content="${escapeHtml(cfg.title)}" />`,
      `<meta property="og:description" content="${escapeHtml(cfg.description)}" />`,
      `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
      `<meta property="og:type" content="${escapeHtml(cfg.ogType || "website")}" />`,
      `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
      `<meta property="og:image" content="${escapeHtml(ogImageUrl)}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escapeHtml(cfg.title)}" />`,
      `<meta name="twitter:description" content="${escapeHtml(cfg.description)}" />`,
      `<meta name="twitter:image" content="${escapeHtml(ogImageUrl)}" />`,
      `<script type="application/ld+json">${JSON.stringify(jsonLdGraph)}</script>`,
    ].join("\n    ");

    const pageHtml = templateHtml
      .replace("<!--seo-head-->", seoHeadBlock)
      .replace("<!--app-html-->", appHtml);

    if (route === "/") {
      fs.writeFileSync(path.join(distDir, "index.html"), pageHtml, "utf-8");
      console.log(`[SSG] Pre-rendered / -> dist/index.html`);
    } else if (route === "/404") {
      fs.writeFileSync(path.join(distDir, "404.html"), pageHtml, "utf-8");
      console.log(`[SSG] Pre-rendered /404 -> dist/404.html`);
    } else {
      const routeOutDir = path.join(distDir, route.replace(/^\//, ""));
      fs.mkdirSync(routeOutDir, { recursive: true });
      fs.writeFileSync(path.join(routeOutDir, "index.html"), pageHtml, "utf-8");
      console.log(`[SSG] Pre-rendered ${route} -> dist/${route.replace(/^\//, "")}/index.html`);
    }
  }

  // Generate sitemap.xml at build time
  const today = new Date().toISOString().split("T")[0];
  const sitemapItems = PUBLIC_PRERENDER_ROUTES.map((route) => {
    const cfg = SEO_PAGES[route];
    const loc = getCanonicalUrl(cfg.canonicalPath);
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${cfg.changefreq || "weekly"}</changefreq>
    <priority>${cfg.priority || "0.8"}</priority>
  </url>`;
  }).join("\n");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapItems}
</urlset>
`;
  fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemapXml, "utf-8");
  console.log(`[SSG] Generated dist/sitemap.xml (${PUBLIC_PRERENDER_ROUTES.length} canonical URLs)`);

  // Generate robots.txt at build time
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(distDir, "robots.txt"), robotsTxt, "utf-8");
  console.log(`[SSG] Generated dist/robots.txt`);

  // Generate .htaccess for Apache / cPanel hosting (301 canonical host + trailing slash + 404)
  const htaccess = `<IfModule mod_rewrite.c>
  RewriteEngine On

  # Force HTTPS and non-www emmbros.com (including emmbros.in -> emmbros.com)
  RewriteCond %{HTTPS} off [OR]
  RewriteCond %{HTTP_HOST} ^www\\. [NC,OR]
  RewriteCond %{HTTP_HOST} ^(www\\.)?emmbros\\.in$ [NC]
  RewriteRule ^ https://emmbros.com%{REQUEST_URI} [L,R=301]

  # Remove trailing slash on non-directory URLs (except root /)
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} ^(.+)/$
  RewriteRule ^(.+)/$ https://emmbros.com/$1 [L,R=301]

  # Legacy short product URLs -> canonical nested URLs
  RewriteRule ^front-axle-shaft/?$ /product-application/front-axle-shaft [L,R=301]
  RewriteRule ^rear-axle-shaft/?$ /product-application/rear-axle-shaft [L,R=301]
  RewriteRule ^gear-box-parts/?$ /product-application/gear-box-parts [L,R=301]
  RewriteRule ^driveline-parts/?$ /product-application/driveline-parts [L,R=301]
  RewriteRule ^hydraulic-parts/?$ /product-application/hydraulic-parts [L,R=301]
  RewriteRule ^planetary-wheel-drive-parts/?$ /product-application/planetary-wheel-drive-parts [L,R=301]
  RewriteRule ^about/?$ /who-we-are [L,R=301]

  # Serve pre-rendered directory index.html if present
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteCond %{REQUEST_FILENAME}/index.html -f
  RewriteRule ^(.*?)/?$ $1/index.html [L]

  # Custom 404 page
  ErrorDocument 404 /404.html
</IfModule>
`;
  fs.writeFileSync(path.join(distDir, ".htaccess"), htaccess, "utf-8");

  // Clean up temporary dist-ssr folder
  fs.rmSync(ssrDir, { recursive: true, force: true });
}

runPrerender().catch((err) => {
  console.error("[Prerender Failed]", err);
  process.exit(1);
});
