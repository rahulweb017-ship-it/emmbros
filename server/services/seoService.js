import { Post } from "../models/Post.js";
import { Job } from "../models/Job.js";
import {
  SITE_URL,
  SITE_NAME,
  SEO_PAGES,
  PUBLIC_PRERENDER_ROUTES,
  getCanonicalUrl,
  normalizeCanonicalPath,
  buildPageJsonLd,
} from "../../client/src/config/seoConfig.js";

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

  // Fetch published blog posts
  const posts = await Post.find({ status: "published" }).select("slug updatedAt createdAt");
  const postUrls = posts.map((p) => ({
    loc: `${SITE_URL}/blog/${p.slug}`,
    lastmod: (p.updatedAt || p.createdAt || new Date()).toISOString().split("T")[0],
    priority: "0.8",
    changefreq: "weekly",
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

  // 1. Single Blog Post: /blog/:slug
  const blogMatch = normPath.match(/^\/blog\/([a-z0-9-]+)$/i);
  if (blogMatch) {
    const slug = blogMatch[1];
    const post = await Post.findOne({ slug, status: "published" });
    if (!post) return null;
    const title = post.seo?.metaTitle || `${post.title} | Emmbros Autocomp Ltd`;
    const description =
      post.seo?.metaDescription || post.excerpt || stripTags(post.content).slice(0, 155);
    const canonical = post.seo?.canonicalUrl || `${SITE_URL}/blog/${post.slug}`;
    const ogImage = post.seo?.ogImage || post.featuredImage?.url || `${SITE_URL}/assets/og/blog-og.webp`;
    let robots = "index, follow";
    if (post.seo?.noindex) robots = "noindex, follow";
    if (post.seo?.nofollow) robots = post.seo?.noindex ? "noindex, nofollow" : "index, nofollow";

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description,
      image: [ogImage],
      datePublished: (post.publishedAt || post.createdAt).toISOString(),
      dateModified: post.updatedAt.toISOString(),
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
    };
    return {
      title,
      description,
      canonical,
      ogImage,
      ogType: "article",
      robots,
      jsonLd,
      bodyHtml: `<article style="max-width:900px;margin:40px auto;padding:0 20px"><h1>${escapeHtml(
        post.title
      )}</h1><div>${post.content || ""}</div></article>`,
    };
  }

  // 2. Single Job Posting: /careers/:slug
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
    `<script type="application/ld+json">${JSON.stringify(cmsMeta.jsonLd)}</script>`,
  ].join("\n    ");

  return htmlShell
    .replace("<!--seo-head-->", seoHeadBlock)
    .replace("<!--app-html-->", cmsMeta.bodyHtml || "");
}
