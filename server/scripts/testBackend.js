import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { connectDB, disconnectDB } from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import publicRoutes from "../routes/publicRoutes.js";
import { errorHandler } from "../middleware/errorHandler.js";
import { User } from "../models/User.js";

async function runTests() {
  console.log("=== Starting Backend Foundation Verification Suite ===");
  await connectDB();

  const app = express();
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api", publicRoutes);
  app.use(errorHandler);

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`[test-server] Running on ${baseUrl}`);

  try {
    // 1. Seed Admin User
    const adminEmail = "testadmin@emmbros.com";
    const adminPassword = "TestPassword123!";
    const passwordHash = await User.hashPassword(adminPassword);
    
    await User.deleteMany({ email: adminEmail });
    const user = new User({
      name: "Test Admin",
      email: adminEmail,
      passwordHash,
      role: "admin",
    });
    await user.save();
    console.log("✓ Admin User Seeded successfully.");

    // 2. Test Login
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok || !loginData.ok || !loginData.token) {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    }
    const token = loginData.token;
    console.log("✓ Login API verified. Token received.");

    // Extract cookie from response headers
    const setCookieHeader = loginRes.headers.get("set-cookie");
    const authHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Cookie: setCookieHeader || `token=${token}`,
    };

    // 3. Test Auth Me
    const meRes = await fetch(`${baseUrl}/api/auth/me`, { headers: authHeaders });
    const meData = await meRes.json();
    if (!meRes.ok || meData.user.email !== adminEmail) {
      throw new Error(`Auth me failed: ${JSON.stringify(meData)}`);
    }
    console.log("✓ GET /api/auth/me verified. Authenticated user returned.");

    // 4. Test Create Admin Post (with HTML Sanitization & SEO Schema)
    const postPayload = {
      title: "Advanced Automotive Forging Trends 2026",
      excerpt: "Overview of modern forging technology in OEM manufacturing.",
      content: "<h2>Forging Innovation</h2><p>Emmbros Autocomp is expanding precision machining capabilities.</p><script>alert('xss')</script>",
      category: "Technology",
      tags: ["Forging", "Automotive", "OEM"],
      status: "published",
      publishedAt: new Date().toISOString(),
      seo: {
        metaTitle: "Automotive Forging Trends 2026 | Emmbros",
        metaDescription: "Discover how Emmbros Autocomp leads precision forging for OEM suppliers.",
        focusKeyword: "precision forging",
        canonicalUrl: "https://emmbrosautocomp.com/forging-trends",
        noindex: false,
        nofollow: false,
      },
    };

    const createPostRes = await fetch(`${baseUrl}/api/admin/posts`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(postPayload),
    });
    const createPostData = await createPostRes.json();
    if (!createPostRes.ok || !createPostData.ok) {
      throw new Error(`Create post failed: ${JSON.stringify(createPostData)}`);
    }
    const createdPost = createPostData.data;
    console.log(`✓ Admin POST /api/admin/posts verified. Generated slug: "${createdPost.slug}"`);

    // Verify HTML Sanitization (<script> tag removed)
    if (createdPost.content.includes("<script>")) {
      throw new Error("HTML Sanitization failed! <script> tag was not stripped.");
    }
    console.log("✓ HTML Content Sanitization verified. Malicious scripts stripped.");

    // 5. Test Public Post Listing & Public Single Post by Slug
    const publicPostsRes = await fetch(`${baseUrl}/api/posts`);
    const publicPostsData = await publicPostsRes.json();
    if (!publicPostsRes.ok || publicPostsData.data.length === 0) {
      throw new Error(`Public posts failed: ${JSON.stringify(publicPostsData)}`);
    }
    console.log(`✓ Public GET /api/posts verified. Found ${publicPostsData.data.length} published post(s).`);

    const publicSinglePostRes = await fetch(`${baseUrl}/api/posts/${createdPost.slug}`);
    const publicSinglePostData = await publicSinglePostRes.json();
    if (!publicSinglePostRes.ok || !publicSinglePostData.data.seo.metaTitle) {
      throw new Error(`Public single post failed: ${JSON.stringify(publicSinglePostData)}`);
    }
    console.log(`✓ Public GET /api/posts/:slug verified. SEO Meta Title: "${publicSinglePostData.data.seo.metaTitle}"`);

    // 6. Test Admin Create Job
    const jobPayload = {
      title: "Senior SCM Executive",
      department: "Supply Chain & Logistics",
      location: "Baddi, HP",
      employmentType: "Full-time",
      experience: "3-5 years OEM automotive experience",
      salaryRange: "Competitive",
      description: "<h3>Job Overview</h3><p>Manage raw material inventory and dispatch scheduling.</p>",
      responsibilities: ["Inventory planning", "Vendor coordination"],
      requirements: ["B.Tech / MBA", "ERP Proficiency"],
      status: "open",
      seo: {
        metaTitle: "Senior SCM Executive Jobs in Baddi | Emmbros",
        metaDescription: "Apply for Senior SCM Executive position at Emmbros Autocomp Ltd.",
        focusKeyword: "SCM Executive Job Baddi",
      },
    };

    const createJobRes = await fetch(`${baseUrl}/api/admin/jobs`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(jobPayload),
    });
    const createJobData = await createJobRes.json();
    if (!createJobRes.ok || !createJobData.ok) {
      throw new Error(`Create job failed: ${JSON.stringify(createJobData)}`);
    }
    const createdJob = createJobData.data;
    console.log(`✓ Admin POST /api/admin/jobs verified. Generated slug: "${createdJob.slug}"`);

    // 7. Test Public Job Listing & Single Job by Slug
    const publicJobsRes = await fetch(`${baseUrl}/api/jobs`);
    const publicJobsData = await publicJobsRes.json();
    if (!publicJobsRes.ok || publicJobsData.data.length === 0) {
      throw new Error(`Public jobs failed: ${JSON.stringify(publicJobsData)}`);
    }
    console.log(`✓ Public GET /api/jobs verified. Found ${publicJobsData.data.length} open job(s).`);

    const publicSingleJobRes = await fetch(`${baseUrl}/api/jobs/${createdJob.slug}`);
    const publicSingleJobData = await publicSingleJobRes.json();
    if (!publicSingleJobRes.ok || !publicSingleJobData.data.seo.focusKeyword) {
      throw new Error(`Public single job failed: ${JSON.stringify(publicSingleJobData)}`);
    }
    console.log(`✓ Public GET /api/jobs/:slug verified. SEO Focus Keyword: "${publicSingleJobData.data.seo.focusKeyword}"`);

    // 8. Test Admin Create Page with Content & SEO
    const pagePayload = {
      title: "Who We Are",
      slug: "who-we-are",
      content: { heroHeading: "Leading Automotive Component Manufacturer" },
      seo: {
        metaTitle: "Who We Are | Emmbros Autocomp Ltd",
        metaDescription: "Emmbros Autocomp Ltd is an IATF 16949-2016 certified automotive manufacturer.",
        focusKeyword: "automotive manufacturer Baddi",
      },
    };

    const createPageRes = await fetch(`${baseUrl}/api/admin/pages`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(pagePayload),
    });
    const createPageData = await createPageRes.json();
    if (!createPageRes.ok || !createPageData.ok) {
      throw new Error(`Create page failed: ${JSON.stringify(createPageData)}`);
    }
    console.log(`✓ Admin POST /api/admin/pages verified. Created page slug: "${createPageData.data.slug}"`);

    // 9. Test Logout
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: "POST",
      headers: authHeaders,
    });
    const logoutData = await logoutRes.json();
    if (!logoutRes.ok || !logoutData.ok) {
      throw new Error(`Logout failed: ${JSON.stringify(logoutData)}`);
    }
    console.log("✓ Logout API verified.");

    console.log("\nALL BACKEND FOUNDATION TESTS PASSED CLEANLY!");
  } catch (err) {
    console.error("\n❌ Backend Test Failed:", err);
    process.exitCode = 1;
  } finally {
    server.close();
    await disconnectDB();
  }
}

runTests();
