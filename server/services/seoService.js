import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Post } from "../models/Post.js";
import { Job } from "../models/Job.js";
import { DEFAULT_POSTS } from "../config/defaultPosts.js";
import {
  SITE_URL,
  SITE_NAME,
  SEO_PAGES,
  PUBLIC_PRERENDER_ROUTES,
  getCanonicalUrl,
  normalizeCanonicalPath,
  buildPageJsonLd,
} from "../../client/src/config/seoConfig.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SSR_DIR = path.resolve(__dirname, "../../client/dist-ssr");

let cachedSsrRenderer = null;

async function getSsrRenderer() {
  if (cachedSsrRenderer) return cachedSsrRenderer;
  const ssrFile = path.join(SSR_DIR, "entry-server.js");
  if (fs.existsSync(ssrFile)) {
    try {
      cachedSsrRenderer = await import(pathToFileURL(ssrFile).href);
      return cachedSsrRenderer;
    } catch (err) {
      console.warn("[ssr] Warning: Could not load SSR module:", err.message);
    }
  }
  return null;
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripTags(html = "") {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function getSitemapXml() {
  const nowStr = new Date().toISOString().split("T")[0];

  const staticUrls = PUBLIC_PRERENDER_ROUTES.map((route) => {
    const cfg = SEO_PAGES[route];
    return {
      loc: getCanonicalUrl(cfg.canonicalPath),
      lastmod: nowStr,
      priority: cfg.priority || "0.8",
      changefreq: cfg.changefreq || "weekly",
    };
  });

  // Fetch published blog posts from DB, fallback to default posts
  let posts = await Post.find({ status: "published" }).select("slug updatedAt createdAt");
  if (!posts || posts.length === 0) {
    posts = DEFAULT_POSTS;
  }
  const postUrls = posts.map((p) => ({
    loc: `${SITE_URL}/blog/${p.slug}`,
    lastmod: (p.updatedAt || p.createdAt || p.publishedAt || new Date()).toISOString().split("T")[0],
    priority: "0.8",
    changefreq: "monthly",
  }));

  // Fetch open jobs
  const jobs = await Job.find({ status: "open" }).select("slug updatedAt createdAt");
  const jobUrls = jobs.map((j) => ({
    loc: `${SITE_URL}/careers/${j.slug}`,
    lastmod: (j.updatedAt || j.createdAt || new Date()).toISOString().split("T")[0],
    priority: "0.7",
    changefreq: "weekly",
  }));

  const allUrls = [...staticUrls, ...postUrls, ...jobUrls];

  const xmlItems = allUrls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || nowStr}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;
}

export function getRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

export async function resolveDynamicCmsMeta(reqPath) {
  const normPath = normalizeCanonicalPath(reqPath);
  const renderer = await getSsrRenderer();

  // 1. Blog Listing Directory: /blog
  if (normPath === "/blog") {
    let posts = await Post.find({ status: "published" })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(12)
      .lean();

    if (!posts || posts.length === 0) {
      posts = DEFAULT_POSTS;
    }

    const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))];
    const initialData = {
      posts,
      pagination: { page: 1, limit: 12, total: posts.length, totalPages: 1 },
      categories,
    };

    let bodyHtml = "";
    if (renderer && typeof renderer.render === "function") {
      try {
        const rendered = renderer.render("/blog", initialData);
        bodyHtml = rendered.appHtml;
      } catch (err) {
        console.error("[ssr] Error rendering /blog:", err.message);
      }
    }

    const title = "Engineering & Manufacturing Blog | Emmbros Autocomp Ltd";
    const description =
      "Explore technical articles, closed-die forging innovations, induction hardening metallurgy, and OEM case studies from Emmbros Autocomp Ltd.";
    const canonical = `${SITE_URL}/blog`;
    const ogImage = `${SITE_URL}/assets/images/logo1.webp`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Emmbros Autocomp Engineering Blog",
      url: canonical,
      description,
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/assets/images/logo1.webp`,
        },
      },
      blogPost: posts.map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        url: `${SITE_URL}/blog/${p.slug}`,
        datePublished: new Date(p.publishedAt || p.createdAt || Date.now()).toISOString(),
      })),
    };

    return {
      title,
      description,
      canonical,
      ogImage,
      ogType: "website",
      robots: "index, follow",
      jsonLd,
      bodyHtml,
      initialData,
    };
  }

  // 2. Single Blog Post: /blog/:slug
  const blogMatch = normPath.match(/^\/blog\/([a-z0-9-]+)$/i);
  if (blogMatch) {
    const slug = blogMatch[1];
    let post = await Post.findOne({ slug, status: "published" }).lean();
    if (!post) {
      post = DEFAULT_POSTS.find((p) => p.slug === slug);
    }
    if (!post) return null;

    const initialData = { post };
    let bodyHtml = "";

    if (renderer && typeof renderer.render === "function") {
      try {
        const rendered = renderer.render(`/blog/${slug}`, initialData);
        bodyHtml = rendered.appHtml;
      } catch (err) {
        console.error(`[ssr] Error rendering /blog/${slug}:`, err.message);
      }
    }

    // Fallback if SSR renderer is absent
    if (!bodyHtml) {
      bodyHtml = `<article style="max-width:840px;margin:40px auto;padding:0 20px">
        <h1>${escapeHtml(post.title)}</h1>
        <div style="font-size:14px;color:#6b7280;margin-bottom:20px">${post.category || "General"} | ${new Date(post.publishedAt || post.createdAt || Date.now()).toDateString()}</div>
        ${post.featuredImage?.url ? `<img src="${post.featuredImage.url}" alt="${escapeHtml(post.featuredImage.alt || post.title)}" style="max-width:100%;height:auto;border-radius:8px;margin-bottom:24px" />` : ""}
        <div>${post.content || ""}</div>
      </article>`;
    }

    const title = post.seo?.metaTitle || `${post.title} | Emmbros Autocomp Ltd`;
    const description =
      post.seo?.metaDescription || post.excerpt || stripTags(post.content).slice(0, 155);
    const canonical = post.seo?.canonicalUrl || `${SITE_URL}/blog/${post.slug}`;
    const ogImage = post.seo?.ogImage || post.featuredImage?.url || `${SITE_URL}/assets/images/logo1.webp`;
    let robots = "index, follow";
    if (post.seo?.noindex) robots = "noindex, follow";
    if (post.seo?.nofollow) robots = post.seo?.noindex ? "noindex, nofollow" : "index, nofollow";

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description,
      image: [ogImage],
      datePublished: new Date(post.publishedAt || post.createdAt || Date.now()).toISOString(),
      dateModified: new Date(post.updatedAt || post.publishedAt || Date.now()).toISOString(),
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
        "@id": canonical,
      },
    };

    return {
      title,
      description,
      canonical,
      ogImage,
      ogType: "article",
      robots,
      jsonLd,
      bodyHtml,
      initialData,
    };
  }

  // 3. Single Job Posting: /careers/:slug
  const careerMatch = normPath.match(/^\/careers\/([a-z0-9-]+)$/i);
  if (careerMatch) {
    const slug = careerMatch[1];
    const job = await Job.findOne({ slug, status: "open" });
    if (!job) return null;
    const title = job.seo?.metaTitle || `${job.title} Job in Baddi | Emmbros Autocomp Ltd`;
    const description =
      job.seo?.metaDescription ||
      `Apply for ${job.title} in ${job.department} at Emmbros Autocomp Ltd in Baddi, Himachal Pradesh. ${job.experience} experience required. Apply online now.`;
    const canonical = job.seo?.canonicalUrl || `${SITE_URL}/careers/${job.slug}`;
    const ogImage = `${SITE_URL}/assets/og/careers-og.webp`;
    let robots = "index, follow";
    if (job.seo?.noindex) robots = "noindex, follow";

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: job.title,
      description: stripTags(job.description),
      datePosted: job.createdAt.toISOString(),
      validThrough: job.applyByDate
        ? job.applyByDate.toISOString()
        : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      employmentType: "FULL_TIME",
      hiringOrganization: {
        "@type": "Organization",
        name: SITE_NAME,
        sameAs: SITE_URL,
        logo: `${SITE_URL}/assets/images/logo1.webp`,
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Plot No. 63, EPIP Phase-1, Jharmajri",
          addressLocality: "Baddi, District Solan",
          addressRegion: "Himachal Pradesh",
          postalCode: "174103",
          addressCountry: "IN",
        },
      },
    };
    return {
      title,
      description,
      canonical,
      ogImage,
      ogType: "website",
      robots,
      jsonLd,
      bodyHtml: `<article style="max-width:900px;margin:40px auto;padding:0 20px"><h1>${escapeHtml(
        job.title
      )}</h1><div>${job.description || ""}</div></article>`,
    };
  }

  return null;
}

export async function injectSeoMetadata(htmlShell, reqPath) {
  const normPath = normalizeCanonicalPath(reqPath);
  const isAdmin = normPath.startsWith("/admin");

  if (isAdmin) {
    const adminHead = [
      `<title>Admin Panel | Emmbros Autocomp Ltd</title>`,
      `<meta name="robots" content="noindex, nofollow" />`,
    ].join("\n    ");
    return htmlShell.replace("<!--seo-head-->", adminHead).replace("<!--app-html-->", "");
  }

  const cmsMeta = await resolveDynamicCmsMeta(normPath);
  if (!cmsMeta) return null;

  let stateScript = "";
  if (cmsMeta.initialData) {
    stateScript = `\n    <script>window.__INITIAL_DATA__ = ${JSON.stringify(cmsMeta.initialData).replace(/</g, "\\u003c")};</script>`;
  }

  const seoHeadBlock = [
    `<title>${escapeHtml(cmsMeta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(cmsMeta.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(cmsMeta.canonical)}" />`,
    `<meta name="robots" content="${escapeHtml(cmsMeta.robots)}" />`,
    `<meta property="og:title" content="${escapeHtml(cmsMeta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(cmsMeta.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(cmsMeta.canonical)}" />`,
    `<meta property="og:type" content="${escapeHtml(cmsMeta.ogType)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:image" content="${escapeHtml(cmsMeta.ogImage)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(cmsMeta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(cmsMeta.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(cmsMeta.ogImage)}" />`,
    `<script type="application/ld+json">${JSON.stringify(cmsMeta.jsonLd)}</script>${stateScript}`,
  ].join("\n    ");

  return htmlShell
    .replace("<!--seo-head-->", seoHeadBlock)
    .replace("<!--app-html-->", cmsMeta.bodyHtml || "");
}
