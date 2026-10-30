import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { UPLOADS_DIR } from "./controllers/mediaController.js";
import { initScheduledPostCron } from "./cron/postScheduler.js";
import { Redirect } from "./models/Redirect.js";
import { getSitemapXml, getRobotsTxt, injectSeoMetadata } from "./services/seoService.js";

const CLIENT_DIST = path.resolve(__dirname, "../client/dist");
const SUBMISSIONS_LOG = path.join(__dirname, "submissions.log");

const app = express();
app.disable("x-powered-by");

// Connect to MongoDB
connectDB();

// Initialize cron worker for scheduled posts & expired jobs
initScheduledPostCron();

// Security headers (Helmet) + custom headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Keep disabled to allow mirrored Elementor/iframe content
    crossOriginEmbedderPolicy: false,
  })
);

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// CORS Security: Restrict allowed origins to production domain & local dev
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:4000", "http://127.0.0.1:4000", "https://emmbros.com"];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// CSRF & Same-Origin Protection for State-Mutating State Requests
app.use((req, res, next) => {
  if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method) && req.path.startsWith("/api/admin")) {
    const origin = req.headers.origin || req.headers.referer;
    if (origin) {
      const isAllowed = ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
      if (!isAllowed) {
        return res.status(403).json({ ok: false, error: "CSRF protection: Request origin not allowed." });
      }
    }
  }
  next();
});

// Block spam query parameters from compromise history (returns 410 Gone)
app.use((req, res, next) => {
  if (req.query.a || req.query.c || (req.query.s && String(req.query.s).length > 80)) {
    return res.status(410).send("410 Gone");
  }
  next();
});

// Force Canonical Host (emmbros.com non-www over HTTPS, 301 redirect www & emmbros.in)
const LEGACY_SHORT_REDIRECTS = {
  "/about": "/who-we-are",
  "/front-axle-shaft": "/product-application/front-axle-shaft",
  "/rear-axle-shaft": "/product-application/rear-axle-shaft",
  "/gear-box-parts": "/product-application/gear-box-parts",
  "/driveline-parts": "/product-application/driveline-parts",
  "/hydraulic-parts": "/product-application/hydraulic-parts",
  "/planetary-wheel-drive-parts": "/product-application/planetary-wheel-drive-parts",
};

app.use((req, res, next) => {
  const host = (req.headers.host || "").toLowerCase();
  const proto = req.headers["x-forwarded-proto"];
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");

  if (!isLocal) {
    if (
      proto === "http" ||
      host.startsWith("www.") ||
      host === "emmbros.in" ||
      host === "www.emmbros.in"
    ) {
      return res.redirect(301, `https://emmbros.com${req.originalUrl}`);
    }
  }

  // Trailing slash normalization (redirect /page/ -> /page, except /api and root /)
  if (req.path.length > 1 && req.path.endsWith("/") && !req.path.startsWith("/api/")) {
    const cleanPath = req.path.replace(/\/+$/, "");
    const target = LEGACY_SHORT_REDIRECTS[cleanPath.toLowerCase()] || cleanPath;
    const qs = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    return res.redirect(301, `${target}${qs}`);
  }

  // Legacy short product URLs -> 301 to canonical nested path
  const legacyTarget = LEGACY_SHORT_REDIRECTS[req.path.toLowerCase()];
  if (legacyTarget) {
    const qs = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    return res.redirect(301, `${legacyTarget}${qs}`);
  }

  next();
});

// 301 Redirect Middleware from Database (Intercepts incoming requests before routes)
app.use(async (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/admin") || path.extname(req.path)) {
    return next();
  }
  try {
    const redirectRule = await Redirect.findOne({ fromUrl: req.path.toLowerCase(), active: true });
    if (redirectRule) {
      console.log(`[redirect] 301 Redirecting ${req.path} -> ${redirectRule.toUrl}`);
      return res.redirect(redirectRule.statusCode || 301, redirectRule.toUrl);
    }
  } catch (err) {
    console.error("[redirect] Error processing redirect rule:", err.message);
  }
  next();
});

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

// Accept multipart form posts (resume/file uploads) up to 15MB.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

const PORT = process.env.PORT || 4000;
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE,
  MAIL_TO,
  MAIL_FROM,
} = process.env;

let transporter = null;
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: String(SMTP_SECURE) === "true" || Number(SMTP_PORT) === 465,
    requireTLS: Number(SMTP_PORT) === 587,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  console.log(`[mail] SMTP configured via ${SMTP_HOST}`);
} else {
  console.warn(
    "[mail] SMTP not configured. Submissions will be logged to submissions.log. " +
      "Set SMTP_* env vars in server/.env to send real email."
  );
}

// Contact form submission route
app.post("/api/contact", upload.any(), async (req, res) => {
  const data = { ...(req.body || {}) };
  const page = data.__page || "";
  delete data.__page;

  const IGNORE = /^(_wpcf7|_wpnonce|g-recaptcha|mf-|_metform)/i;
  const fields = Object.entries(data)
    .filter(([k, v]) => v !== undefined && String(v) !== "" && !IGNORE.test(k))
    .map(([k, v]) => ({ k, v: String(v) }));

  const attachments = (req.files || [])
    .filter((f) => f.buffer && f.size > 0)
    .map((f) => ({ filename: f.originalname || f.fieldname, content: f.buffer }));

  if (fields.length === 0 && attachments.length === 0) {
    return res.status(400).json({ ok: false, error: "empty submission" });
  }

  const textBody =
    `New submission from the Emmbros website\nPage: ${page}\n\n` +
    fields.map((f) => `${f.k}: ${f.v}`).join("\n");
  const htmlBody =
    `<h2>New submission from the Emmbros website</h2>` +
    `<p><strong>Page:</strong> ${escapeHtml(page)}</p><table cellpadding="6" style="border-collapse:collapse">` +
    fields
      .map(
        (f) =>
          `<tr><td style="border:1px solid #ddd"><strong>${escapeHtml(
            f.k
          )}</strong></td><td style="border:1px solid #ddd">${escapeHtml(
            f.v
          )}</td></tr>`
      )
      .join("") +
    `</table>`;

  try {
    if (transporter) {
      await transporter.sendMail({
        from: MAIL_FROM || SMTP_USER,
        to: MAIL_TO || SMTP_USER,
        replyTo: data.email || data["your-email"] || undefined,
        subject: `Emmbros website enquiry${page ? ` (${page})` : ""}`,
        text: textBody,
        html: htmlBody,
        attachments,
      });
    } else {
      const attachNote = attachments.length
        ? `\nattachments: ${attachments.map((a) => a.filename).join(", ")}`
        : "";
      fs.appendFileSync(
        SUBMISSIONS_LOG,
        `\n[${new Date().toISOString()}] ${page}\n${textBody}${attachNote}\n`
      );
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("[mail] send failed:", err.message);
    res.status(500).json({ ok: false, error: "could not send message" });
  }
});

// Dynamic XML Sitemap
app.get("/sitemap.xml", async (req, res, next) => {
  try {
    const xml = await getSitemapXml();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    next(err);
  }
});

// Dynamic Robots.txt
app.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(getRobotsTxt());
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", publicRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true, mail: !!transporter }));

// Global Error Handler for API routes
app.use(errorHandler);

// Serve uploaded media files directly
app.use("/uploads", express.static(UPLOADS_DIR, { maxAge: "30d" }));

// Serve the built React client with Pre-Rendered SSG HTML + Dynamic CMS Fallback + Real HTTP 404
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

if (fs.existsSync(CLIENT_DIST)) {
  const indexHtmlPath = path.join(CLIENT_DIST, "index.html");
  const spaShellPath = path.join(CLIENT_DIST, "_spa_shell.html");
  const notFoundHtmlPath = path.join(CLIENT_DIST, "404.html");

  // WebP content negotiation
  app.get(/^\/wp-content\/uploads\/.+\.(jpe?g|png)$/i, (req, res, next) => {
    const accept = req.headers.accept || "";
    if (!accept.includes("image/webp")) return next();

    const decodedPath = decodeURIComponent(req.path);
    const ext = path.extname(decodedPath);
    const webpRel = decodedPath.slice(0, -ext.length) + ".webp";
    const webpPath = path.join(CLIENT_DIST, webpRel.replace(/^\//, ""));

    if (fs.existsSync(webpPath)) {
      res.setHeader("Content-Type", "image/webp");
      res.setHeader("Vary", "Accept");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.sendFile(webpPath);
    }
    next();
  });

  // Serve static assets with long cache headers (1 year immutable on hashed assets & images)
  app.use(
    express.static(CLIENT_DIST, {
      maxAge: "30d",
      index: false,
      redirect: false,
      setHeaders: (res, filePath) => {
        if (/\.(webp|jpg|jpeg|png|gif|svg|woff2?|ttf|eot|css|js|ico)$/i.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else if (/\.(html)$/i.test(filePath)) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        } else if (/\.(txt|xml)$/i.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=3600");
        }
      },
    })
  );

  // Route handler for Pre-Rendered Static Pages, Dynamic CMS Pages, and Real HTTP 404
  app.get("*", async (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    if (path.extname(req.path) && !req.path.endsWith(".html")) {
      return res.status(404).send("File not found");
    }

    const cleanPath = req.path.replace(/\/+$/, "") || "/";

    // 1. Check if a pre-rendered static HTML file exists for this exact route
    const prerenderFile =
      cleanPath === "/"
        ? indexHtmlPath
        : path.join(CLIENT_DIST, cleanPath.replace(/^\//, ""), "index.html");

    if (fs.existsSync(prerenderFile)) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.status(200).sendFile(prerenderFile);
    }

    // 2. Check if it is an Admin route or a valid published CMS route (/blog/:slug or /careers/:slug)
    try {
      const shellPath = fs.existsSync(spaShellPath) ? spaShellPath : indexHtmlPath;
      const shellHtml = fs.readFileSync(shellPath, "utf-8");
      const injectedHtml = await injectSeoMetadata(shellHtml, cleanPath);

      if (injectedHtml) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        return res.status(200).send(injectedHtml);
      }
    } catch (err) {
      console.error("[seo] Error resolving dynamic route:", err.message);
    }

    // 3. Unknown URL -> Return real HTTP 404 with pre-rendered 404.html
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    if (fs.existsSync(notFoundHtmlPath)) {
      return res.status(404).sendFile(notFoundHtmlPath);
    }
    return res.status(404).send("404 Page Not Found");
  });
} else {
  console.warn(`[static] ${CLIENT_DIST} not found. Run "npm run build" in client/ first.`);
}

app.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`));
