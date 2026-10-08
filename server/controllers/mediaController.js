import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { Media } from "../models/Media.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = path.resolve(__dirname, "../../client/public/uploads");
export const DIST_UPLOADS_DIR = path.resolve(__dirname, "../../client/dist/uploads");

// Ensure upload directories exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (fs.existsSync(path.resolve(__dirname, "../../client/dist")) && !fs.existsSync(DIST_UPLOADS_DIR)) {
  fs.mkdirSync(DIST_UPLOADS_DIR, { recursive: true });
}

export async function uploadMedia(req, res, next) {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    if (files.length === 0) {
      return res.status(400).json({ ok: false, error: "No media files provided." });
    }

    const createdMediaRecords = [];

    for (const file of files) {
      // Validate file size (max 5 MB)
      if (file.size > 5 * 1024 * 1024) {
        return res.status(400).json({ ok: false, error: `File "${file.originalname}" exceeds 5MB limit.` });
      }

      const timestamp = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
      const baseName = path.parse(file.originalname).name.replace(/[^\w-]/g, "_");
      const filename = `${baseName}-${timestamp}.webp`;
      const thumbFilename = `${baseName}-${timestamp}-thumb.webp`;

      const targetPath = path.join(UPLOADS_DIR, filename);
      const thumbTargetPath = path.join(UPLOADS_DIR, thumbFilename);

      let finalMimeType = "image/webp";
      let finalSize = file.size;

      if (file.mimetype.startsWith("image/") && !file.mimetype.includes("svg")) {
        // Convert to optimized WebP
        const webpBuffer = await sharp(file.buffer)
          .webp({ quality: 82 })
          .toBuffer();
        
        fs.writeFileSync(targetPath, webpBuffer);
        finalSize = webpBuffer.length;

        // Generate resized thumbnail (300px width)
        const thumbBuffer = await sharp(file.buffer)
          .resize({ width: 300, withoutEnlargement: true })
          .webp({ quality: 75 })
          .toBuffer();
        
        fs.writeFileSync(thumbTargetPath, thumbBuffer);

        // Copy to dist uploads if client/dist exists
        if (fs.existsSync(DIST_UPLOADS_DIR)) {
          fs.writeFileSync(path.join(DIST_UPLOADS_DIR, filename), webpBuffer);
          fs.writeFileSync(path.join(DIST_UPLOADS_DIR, thumbFilename), thumbBuffer);
        }
      } else {
        // SVGs / fallback files
        fs.writeFileSync(targetPath, file.buffer);
        finalMimeType = file.mimetype;
        if (fs.existsSync(DIST_UPLOADS_DIR)) {
          fs.writeFileSync(path.join(DIST_UPLOADS_DIR, filename), file.buffer);
        }
      }

      const publicUrl = `/uploads/${filename}`;
      const media = new Media({
        url: publicUrl,
        filename: file.originalname,
        mimeType: finalMimeType,
        size: finalSize,
        alt: req.body.alt || baseName.replace(/_/g, " "),
        uploadedBy: req.user?._id,
      });

      await media.save();
      createdMediaRecords.push(media);
    }

    res.status(201).json({
      ok: true,
      data: createdMediaRecords.length === 1 ? createdMediaRecords[0] : createdMediaRecords,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMediaList(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 24));
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.q) {
      const searchRegex = new RegExp(req.query.q.trim(), "i");
      query.$or = [{ filename: searchRegex }, { alt: searchRegex }];
    }

    const [mediaItems, total] = await Promise.all([
      Media.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Media.countDocuments(query),
    ]);

    res.json({
      ok: true,
      data: mediaItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateMediaAlt(req, res, next) {
  try {
    const { alt } = req.body;
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ ok: false, error: "Media item not found." });
    }

    media.alt = String(alt || "").trim();
    await media.save();
    res.json({ ok: true, data: media });
  } catch (err) {
    next(err);
  }
}

export async function deleteMedia(req, res, next) {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ ok: false, error: "Media item not found." });
    }

    const localFilename = path.basename(media.url);
    const thumbFilename = localFilename.replace(/\.webp$/, "-thumb.webp");

    const filePath = path.join(UPLOADS_DIR, localFilename);
    const thumbPath = path.join(UPLOADS_DIR, thumbFilename);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);

    if (fs.existsSync(DIST_UPLOADS_DIR)) {
      const distFilePath = path.join(DIST_UPLOADS_DIR, localFilename);
      const distThumbPath = path.join(DIST_UPLOADS_DIR, thumbFilename);
      if (fs.existsSync(distFilePath)) fs.unlinkSync(distFilePath);
      if (fs.existsSync(distThumbPath)) fs.unlinkSync(distThumbPath);
    }

    await Media.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: "Media file deleted successfully." });
  } catch (err) {
    next(err);
  }
}
