import express from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { getPublicPosts, getPublicPostBySlug } from "../controllers/postController.js";
import { getPublicJobs, getPublicJobBySlug } from "../controllers/jobController.js";
import { getPublicPageBySlug } from "../controllers/pageController.js";
import { submitApplication } from "../controllers/applicationController.js";
import { getPublicSettings } from "../controllers/settingController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

const applyRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 submissions per IP
  message: { ok: false, error: "Too many job applications submitted from this IP, please try again later." },
});

// Public Site Settings
router.get("/settings", getPublicSettings);

// Public Posts
router.get("/posts", getPublicPosts);
router.get("/posts/:slug", getPublicPostBySlug);

// Public Jobs
router.get("/jobs", getPublicJobs);
router.get("/jobs/:slug", getPublicJobBySlug);
router.post("/jobs/:slug/apply", applyRateLimiter, upload.single("resume"), submitApplication);

// Public Page SEO & Content metadata
router.get("/pages/:slug", getPublicPageBySlug);

export default router;
