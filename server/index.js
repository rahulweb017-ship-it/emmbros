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
  app.use(express.static(CLIENT_DIST));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(CLIENT_DIST, "index.html"));
  });
} else {
  console.warn(`[static] ${CLIENT_DIST} not found. Run "npm run build" in client/ first.`);
}

app.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`));
