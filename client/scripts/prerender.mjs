import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { DEFAULT_POSTS } from "../../server/config/defaultPosts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(__dirname, "..");
const distDir = path.join(clientRoot, "dist");
const ssrDir = path.join(clientRoot, "dist-ssr");

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

  // Common categories for blog
  const blogCategories = [...new Set(DEFAULT_POSTS.map((p) => p.category).filter(Boolean))];
  const blogInitialData = {
    posts: DEFAULT_POSTS,
    pagination: { page: 1, limit: 9, total: DEFAULT_POSTS.length, totalPages: 1 },
    categories: blogCategories,
  };

  for (const route of allRoutes) {
    const cfg = SEO_PAGES[route];
    if (!cfg || !cfg.title || !cfg.description || !cfg.canonicalPath) {
      throw new Error(`[Prerender Error] Missing SEO metadata in seoConfig.js for route: ${route}`);
    }

    // If route is /blog, pass blogInitialData so real articles are rendered during SSG!
    let routeInitialData = null;
    if (route === "/blog") {
      routeInitialData = blogInitialData;
    }

    const targetUrl = route === "/404" ? "/404-not-found-page" : route;
    const { appHtml } = render(targetUrl, routeInitialData);
    const canonicalUrl = getCanonicalUrl(cfg.canonicalPath);
    const ogImageUrl = cfg.ogImage.startsWith("http") ? cfg.ogImage : `${SITE_URL}${cfg.ogImage}`;
    const jsonLdGraph = buildPageJsonLd(route);

    let stateScript = "";
    if (routeInitialData) {
      stateScript = `\n    <script>window.__INITIAL_DATA__ = ${JSON.stringify(routeInitialData).replace(/</g, "\\u003c")};</script>`;
    }

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
      `<script type="application/ld+json">${JSON.stringify(jsonLdGraph)}</script>${stateScript}`,
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

  // Pre-render each individual blog article for Static Site Generation (SSG)
  for (const post of DEFAULT_POSTS) {
    const postRoute = `/blog/${post.slug}`;
    const postInitialData = { post };
    const { appHtml } = render(postRoute, postInitialData);

    const postCanonical = post.seo?.canonicalUrl || `${SITE_URL}/blog/${post.slug}`;
    const postTitle = post.seo?.metaTitle || `${post.title} | ${SITE_NAME}`;
    const postDesc = post.seo?.metaDescription || post.excerpt;
    const postOgImage = post.seo?.ogImage || post.featuredImage?.url || `${SITE_URL}/assets/images/logo1.webp`;

    const articleJsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: postDesc,
      image: [postOgImage],
      datePublished: new Date(post.publishedAt || Date.now()).toISOString(),
      dateModified: new Date(post.publishedAt || Date.now()).toISOString(),
      author: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/assets/images/logo1.webp`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": postCanonical,
      },
    };

    const postStateScript = `\n    <script>window.__INITIAL_DATA__ = ${JSON.stringify(postInitialData).replace(/</g, "\\u003c")};</script>`;

    const postHeadBlock = [
      `<title>${escapeHtml(postTitle)}</title>`,
      `<meta name="description" content="${escapeHtml(postDesc)}" />`,
      `<link rel="canonical" href="${escapeHtml(postCanonical)}" />`,
      `<meta name="robots" content="index, follow" />`,
      `<meta property="og:title" content="${escapeHtml(postTitle)}" />`,
      `<meta property="og:description" content="${escapeHtml(postDesc)}" />`,
      `<meta property="og:url" content="${escapeHtml(postCanonical)}" />`,
      `<meta property="og:type" content="article" />`,
      `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
      `<meta property="og:image" content="${escapeHtml(postOgImage)}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escapeHtml(postTitle)}" />`,
      `<meta name="twitter:description" content="${escapeHtml(postDesc)}" />`,
      `<meta name="twitter:image" content="${escapeHtml(postOgImage)}" />`,
      `<script type="application/ld+json">${JSON.stringify(articleJsonLd)}</script>${postStateScript}`,
    ].join("\n    ");

    const articleHtml = templateHtml
      .replace("<!--seo-head-->", postHeadBlock)
      .replace("<!--app-html-->", appHtml);

    const articleOutDir = path.join(distDir, "blog", post.slug);
    fs.mkdirSync(articleOutDir, { recursive: true });
    fs.writeFileSync(path.join(articleOutDir, "index.html"), articleHtml, "utf-8");
    console.log(`[SSG] Pre-rendered Article ${postRoute} -> dist/blog/${post.slug}/index.html`);
  }

  // Generate sitemap.xml at build time (including static routes + pre-rendered blog articles)
  const today = new Date().toISOString().split("T")[0];
  const sitemapItems = [
    ...PUBLIC_PRERENDER_ROUTES.map((route) => {
      const cfg = SEO_PAGES[route];
      const loc = getCanonicalUrl(cfg.canonicalPath);
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${cfg.changefreq || "weekly"}</changefreq>
    <priority>${cfg.priority || "0.8"}</priority>
  </url>`;
    }),
    ...DEFAULT_POSTS.map((post) => `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`),
  ].join("\n");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapItems}
</urlset>
`;
  fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemapXml, "utf-8");
  console.log(`[SSG] Generated dist/sitemap.xml with ${PUBLIC_PRERENDER_ROUTES.length + DEFAULT_POSTS.length} canonical URLs`);

  // Generate robots.txt at build time
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
# LLM & AI Agent Context: ${SITE_URL}/llms.txt
`;
  fs.writeFileSync(path.join(distDir, "robots.txt"), robotsTxt, "utf-8");
  console.log(`[SSG] Generated dist/robots.txt`);

  // Deploy llms.txt and llms-full.txt to dist/ for LLMs and AI agent crawlers
  const publicDir = path.join(clientRoot, "public");
  for (const llmFile of ["llms.txt", "llms-full.txt"]) {
    const src = path.join(publicDir, llmFile);
    const dest = path.join(distDir, llmFile);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`[SSG] Deployed dist/${llmFile}`);
    }
  }

  // Clean up legacy dist/careers if present so Express/Apache won't serve a directory index
  const legacyCareersDir = path.join(distDir, "careers");
  if (fs.existsSync(legacyCareersDir)) {
    fs.rmSync(legacyCareersDir, { recursive: true, force: true });
    console.log(`[SSG] Removed legacy directory: ${legacyCareersDir}`);
  }

  // Generate .htaccess for Apache / cPanel hosting
  const htaccess = `<IfModule mod_rewrite.c>
  RewriteEngine On

  # Force HTTPS and non-www emmbros.com
  RewriteCond %{HTTPS} off [OR]
  RewriteCond %{HTTP_HOST} ^www\\. [NC,OR]
  RewriteCond %{HTTP_HOST} ^(www\\.)?emmbros\\.in$ [NC]
  RewriteRule ^ https://emmbros.com%{REQUEST_URI} [L,R=301]

  # Remove trailing slash on non-directory URLs (except root /)
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} ^(.+)/$
  RewriteRule ^(.+)/$ https://emmbros.com/$1 [L,R=301]

  # Legacy short product URLs -> canonical nested URLs
  RewriteRule ^careers/?$ /career [L,R=301]
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

  // Keep dist-ssr available for Node server SSR! (Do NOT delete ssrDir)
  console.log(`[SSG] Retaining ${ssrDir} for server-side dynamic SSR rendering.`);
}

runPrerender().catch((err) => {
  console.error("[Prerender Failed]", err);
  process.exit(1);
});
