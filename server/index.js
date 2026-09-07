import "dotenv/config";
import express from "express";
import nodemailer from "nodemailer";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIST = path.resolve(__dirname, "../client/dist");
const SUBMISSIONS_LOG = path.join(__dirname, "submissions.log");

const app = express();
app.disable("x-powered-by");

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  next();
});

// Block spam query parameters from compromise history (returns 410 Gone)
app.use((req, res, next) => {
  if (req.query.a || req.query.c || (req.query.s && String(req.query.s).length > 80)) {
    return res.status(410).send("410 Gone");
  }
  next();
});

app.use(express.json({ limit: "1mb" }));

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
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  console.log(`[mail] SMTP configured via ${SMTP_HOST}`);
} else {
  console.warn(
    "[mail] SMTP not configured. Submissions will be logged to submissions.log. " +
      "Set SMTP_* env vars in server/.env to send real email."
  );
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

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

app.get("/api/health", (req, res) => res.json({ ok: true, mail: !!transporter }));

// Serve the built React client (which includes the mirrored pages + assets).
if (fs.existsSync(CLIENT_DIST)) {
  // WebP content negotiation: transparently serve .webp when requested .jpg/.png has a .webp version
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

  // Serve static assets with efficient caching
  app.use(
    express.static(CLIENT_DIST, {
      maxAge: "30d",
      setHeaders: (res, filePath) => {
        if (/\.(webp|jpg|jpeg|png|gif|svg|woff2?|ttf|eot|css|js|ico)$/i.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else if (/\.(html|txt|xml)$/i.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=3600");
        }
      },
    })
  );

  // Catch-all route for SPA navigation. Return 404 for missing files with extensions.
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    if (path.extname(req.path)) {
      return res.status(404).send("File not found");
    }
    res.sendFile(path.join(CLIENT_DIST, "index.html"));
  });
} else {
  console.warn(`[static] ${CLIENT_DIST} not found. Run "npm run build" in client/ first.`);
}

app.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`));
