import { Post } from "../models/Post.js";
import { Job } from "../models/Job.js";
import { Page } from "../models/Page.js";

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

// In-memory cache for rendered meta tag blocks (5 minutes)
const metaCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function getSitemapXml() {
  const baseUrl = "https://emmbros.com";
  const nowStr = new Date().toISOString().split("T")[0];

  // Static core routes
  const staticUrls = [
    { loc: `${baseUrl}/`, priority: "1.0", changefreq: "daily" },
    { loc: `${baseUrl}/who-we-are`, priority: "0.8", changefreq: "weekly" },
    { loc: `${baseUrl}/blog`, priority: "0.9", changefreq: "daily" },
    { loc: `${baseUrl}/careers`, priority: "0.9", changefreq: "daily" },
  ];

  // Fetch published blog posts
  const posts = await Post.find({ status: "published" }).select("slug updatedAt createdAt");
  const postUrls = posts.map((p) => ({
    loc: `${baseUrl}/blog/${p.slug}`,
    lastmod: (p.updatedAt || p.createdAt || new Date()).toISOString().split("T")[0],
    priority: "0.8",
    changefreq: "weekly",
  }));

  // Fetch open jobs
  const jobs = await Job.find({ status: "open" }).select("slug updatedAt createdAt");
  const jobUrls = jobs.map((j) => ({
    loc: `${baseUrl}/careers/${j.slug}`,
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
Disallow: /admin/
Disallow: /api/

Sitemap: https://emmbros.com/sitemap.xml
`;
}

export async function injectSeoMetadata(htmlTemplate, reqPath) {
  const cached = metaCache.get(reqPath);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.html;
  }

  let title = "Emmbros Autocomp Ltd | Leading Automotive Forging Manufacturer";
  let description = "Emmbros Autocomp Ltd is a premier Tier-1 manufacturer of closed-die automotive forging components based in Baddi, Himachal Pradesh.";
  let canonical = `https://emmbros.com${reqPath}`;
  let ogImage = "https://emmbros.com/wp-content/uploads/2025/12/logo1.webp";
  let ogType = "website";
  let robots = "index, follow";
  let jsonLd = null;

  // 1. Single Blog Post: /blog/:slug
  const blogMatch = reqPath.match(/^\/blog\/([a-z0-9-]+)$/i);
  if (blogMatch) {
    const slug = blogMatch[1];
    const post = await Post.findOne({ slug, status: "published" });
    if (post) {
      title = post.seo?.metaTitle || `${post.title} | Emmbros Autocomp`;
      description = post.seo?.metaDescription || post.excerpt || stripTags(post.content).slice(0, 155);
      canonical = post.seo?.canonicalUrl || `https://emmbros.com/blog/${post.slug}`;
      ogImage = post.seo?.ogImage || post.featuredImage?.url || ogImage;
      ogType = "article";

      if (post.seo?.noindex) robots = "noindex, follow";
      if (post.seo?.nofollow) robots = post.seo?.noindex ? "noindex, nofollow" : "index, nofollow";

      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": description,
        "image": ogImage ? [ogImage] : [],
        "datePublished": (post.publishedAt || post.createdAt).toISOString(),
        "dateModified": post.updatedAt.toISOString(),
        "author": {
          "@type": "Organization",
          "name": "Emmbros Autocomp Ltd",
          "url": "https://emmbros.com",
        },
        "publisher": {
          "@type": "Organization",
          "name": "Emmbros Autocomp Ltd",
          "logo": {
            "@type": "ImageObject",
            "url": "https://emmbros.com/wp-content/uploads/2025/12/logo1.webp",
          },
        },
      };
    }
  }

  // 2. Single Job Posting: /careers/:slug
  const careerMatch = reqPath.match(/^\/careers\/([a-z0-9-]+)$/i);
  if (careerMatch) {
    const slug = careerMatch[1];
    const job = await Job.findOne({ slug, status: "open" });
    if (job) {
      title = job.seo?.metaTitle || `${job.title} Job opening in Baddi | Emmbros Autocomp`;
      description = job.seo?.metaDescription || `Apply for ${job.title} position in ${job.department} at Emmbros Autocomp Ltd, Baddi. ${job.experience} experience required.`;
      canonical = job.seo?.canonicalUrl || `https://emmbros.com/careers/${job.slug}`;

      if (job.seo?.noindex) robots = "noindex, follow";
      if (job.seo?.nofollow) robots = job.seo?.noindex ? "noindex, nofollow" : "index, nofollow";

      let empType = "FULL_TIME";
      if (job.employmentType === "Part-time") empType = "PART_TIME";
      if (job.employmentType === "Contract") empType = "CONTRACTOR";
      if (job.employmentType === "Internship") empType = "INTERN";

      jsonLd = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": job.title,
        "description": stripTags(job.description),
        "datePosted": job.createdAt.toISOString(),
        "validThrough": job.applyByDate ? job.applyByDate.toISOString() : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        "employmentType": empType,
        "hiringOrganization": {
          "@type": "Organization",
          "name": "Emmbros Autocomp Ltd",
          "sameAs": "https://emmbros.com",
          "logo": "https://emmbros.com/wp-content/uploads/2025/12/logo1.webp",
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Plot No 46, Phase 1",
            "addressLocality": "Baddi",
            "addressRegion": "Himachal Pradesh",
            "postalCode": "173205",
            "addressCountry": "IN",
          },
        },
      };
    }
  }

  // 3. Homepage Organization JSON-LD
  if (reqPath === "/" || reqPath === "/index.html") {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Emmbros Autocomp Ltd",
      "url": "https://emmbros.com",
      "logo": "https://emmbros.com/wp-content/uploads/2025/12/logo1.webp",
      "description": "Leading Tier-1 manufacturer of closed-die automotive forging components in Baddi, Himachal Pradesh.",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-1795-244500",
        "contactType": "customer service",
        "areaServed": "IN",
      },
    };
  }

  // Build HTML Meta Tag Header String
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeCanonical = escapeHtml(canonical);
  const safeOgImage = escapeHtml(ogImage);
  const safeRobots = escapeHtml(robots);

  let metaBlock = `
    <!-- Injected Server-Side Crawlable SEO Meta Tags -->
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDesc}">
    <link rel="canonical" href="${safeCanonical}">
    <meta name="robots" content="${safeRobots}">

    <!-- OpenGraph Tags -->
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDesc}">
    <meta property="og:image" content="${safeOgImage}">
    <meta property="og:type" content="${ogType}">
    <meta property="og:url" content="${safeCanonical}">

    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDesc}">
    <meta name="twitter:image" content="${safeOgImage}">
  `;

  if (jsonLd) {
    metaBlock += `
    <script type="application/ld+json">
      ${JSON.stringify(jsonLd, null, 2)}
    </script>
    `;
  }

  // Inject meta tags into document head
  let modifiedHtml = htmlTemplate;
  if (modifiedHtml.includes("<title>")) {
    modifiedHtml = modifiedHtml.replace(/<title>[\s\S]*?<\/title>/i, "");
  }
  modifiedHtml = modifiedHtml.replace("</head>", `${metaBlock}\n</head>`);

  metaCache.set(reqPath, { html: modifiedHtml, timestamp: Date.now() });
  return modifiedHtml;
}
