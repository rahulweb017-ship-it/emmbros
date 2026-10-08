import "dotenv/config";
import { connectDB } from "../config/db.js";
import { Post } from "../models/Post.js";
import { Job } from "../models/Job.js";
import { Redirect } from "../models/Redirect.js";
import { getSitemapXml, getRobotsTxt, injectSeoMetadata } from "../services/seoService.js";

async function runPhase6Tests() {
  console.log("=== Starting Phase 6 Verification Suite ===");

  await connectDB();

  // 1. Sitemap XML Verification
  const sitemapXml = await getSitemapXml();
  if (!sitemapXml.includes("<?xml") || !sitemapXml.includes("<urlset") || !sitemapXml.includes("https://emmbros.com/")) {
    throw new Error("Sitemap XML generation failed.");
  }
  console.log("✓ Dynamic Sitemap XML verified.");

  // 2. Robots.txt Verification
  const robotsTxt = getRobotsTxt();
  if (!robotsTxt.includes("Disallow: /admin/") || !robotsTxt.includes("Sitemap: https://emmbros.com/sitemap.xml")) {
    throw new Error("Robots.txt generation failed.");
  }
  console.log("✓ Robots.txt generation verified.");

  // 3. Create sample post & job for meta injection test
  const postSlug = `seo-test-article-${Date.now()}`;
  const testPost = await Post.create({
    title: "Precision Closed-Die Forging Technology",
    slug: postSlug,
    excerpt: "Exploring modern closed-die forging process for high strength automotive parts.",
    content: "<p>Detailed technical content about forging processes in Baddi.</p>",
    status: "published",
    publishedAt: new Date(),
    seo: {
      metaTitle: "Precision Closed-Die Forging Technology | Emmbros",
      metaDescription: "Exploring modern closed-die forging process for high strength automotive parts.",
      focusKeyword: "closed die forging",
    },
  });

  const jobSlug = `qa-engineer-test-${Date.now()}`;
  const testJob = await Job.create({
    title: "Quality Assurance Metallurgy Engineer",
    slug: jobSlug,
    department: "Quality Control",
    location: "Baddi, Himachal Pradesh",
    experience: "3-5 Years",
    description: "<p>Oversee metallurgical quality and CMM inspections.</p>",
    status: "open",
    seo: {
      metaTitle: "QA Metallurgy Engineer Job in Baddi | Emmbros",
      metaDescription: "Apply for QA Metallurgy Engineer position at Emmbros Autocomp Ltd.",
    },
  });

  // 4. Test Meta Tag & JSON-LD Injection for Blog Post
  const templateHtml = "<html><head><title>Default</title></head><body><div id='root'></div></body></html>";
  const postInjectedHtml = await injectSeoMetadata(templateHtml, `/blog/${postSlug}`);

  if (
    !postInjectedHtml.includes("<title>Precision Closed-Die Forging Technology | Emmbros</title>") ||
    !postInjectedHtml.includes('meta name="description" content="Exploring modern closed-die forging process') ||
    !postInjectedHtml.includes('"@type": "Article"')
  ) {
    throw new Error("Server-Side Meta & JSON-LD Injection failed for blog post.");
  }
  console.log("✓ Blog Post Server-Side Meta Tag & JSON-LD (Article) Injection verified.");

  // 5. Test Meta Tag & JSON-LD Injection for Job Posting
  const jobInjectedHtml = await injectSeoMetadata(templateHtml, `/careers/${jobSlug}`);

  if (
    !jobInjectedHtml.includes("<title>QA Metallurgy Engineer Job in Baddi | Emmbros</title>") ||
    !jobInjectedHtml.includes('"@type": "JobPosting"') ||
    !jobInjectedHtml.includes('"name": "Emmbros Autocomp Ltd"')
  ) {
    throw new Error("Server-Side Meta & JSON-LD Injection failed for job posting.");
  }
  console.log("✓ Job Posting Server-Side Meta Tag & JSON-LD (JobPosting) Injection verified.");

  // 6. Test 301 Redirect Record
  const redirect = await Redirect.create({
    fromUrl: `/legacy-page-${Date.now()}`,
    toUrl: "/who-we-are",
    statusCode: 301,
    active: true,
  });

  const foundRedirect = await Redirect.findOne({ fromUrl: redirect.fromUrl, active: true });
  if (!foundRedirect || foundRedirect.toUrl !== "/who-we-are") {
    throw new Error("301 Redirect mechanism lookup failed.");
  }
  console.log(`✓ 301 Redirect Lookup verified (${foundRedirect.fromUrl} -> ${foundRedirect.toUrl}).`);

  console.log("\nALL PHASE 6 VERIFICATION TESTS PASSED CLEANLY!");
  process.exit(0);
}

runPhase6Tests().catch((err) => {
  console.error("Phase 6 Test Failed:", err);
  process.exit(1);
});
