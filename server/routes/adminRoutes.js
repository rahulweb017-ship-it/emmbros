import express from "express";
import multer from "multer";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import {
  getAdminPosts,
  getAdminPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import {
  getAdminJobs,
  getAdminJobById,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import {
  getAdminPages,
  getAdminPageById,
  createPage,
  updatePage,
  deletePage,
  syncDefaultPages,
} from "../controllers/pageController.js";
import {
  uploadMedia,
  getMediaList,
  updateMediaAlt,
  deleteMedia,
} from "../controllers/mediaController.js";
import {
  getJobApplications,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/applicationController.js";
import {
  getRedirects,
  createRedirect,
  updateRedirect,
  deleteRedirect,
} from "../controllers/redirectController.js";
import {
  getAdminSettings,
  updateSettings,
  getActivityLogs,
} from "../controllers/settingController.js";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();
const memoryUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// All admin routes require authenticated session
router.use(requireAuth);

// Editor & Admin accessible routes (Posts, Jobs, Applications, Pages, Media, Redirects)
router.get("/posts", requireRole("admin", "editor"), getAdminPosts);
router.post("/posts", requireRole("admin", "editor"), createPost);
router.get("/posts/:id", requireRole("admin", "editor"), getAdminPostById);
router.put("/posts/:id", requireRole("admin", "editor"), updatePost);
router.delete("/posts/:id", requireRole("admin", "editor"), deletePost);

router.get("/jobs", requireRole("admin", "editor"), getAdminJobs);
router.post("/jobs", requireRole("admin", "editor"), createJob);
router.get("/jobs/:id", requireRole("admin", "editor"), getAdminJobById);
router.put("/jobs/:id", requireRole("admin", "editor"), updateJob);
router.delete("/jobs/:id", requireRole("admin", "editor"), deleteJob);

router.get("/jobs/:jobId/applications", requireRole("admin", "editor"), getJobApplications);
router.get("/applications", requireRole("admin", "editor"), getAllApplications);
router.put("/applications/:id/status", requireRole("admin", "editor"), updateApplicationStatus);
router.delete("/applications/:id", requireRole("admin", "editor"), deleteApplication);

router.post("/pages/sync", requireRole("admin", "editor"), syncDefaultPages);
router.get("/pages", requireRole("admin", "editor"), getAdminPages);
router.post("/pages", requireRole("admin", "editor"), createPage);
router.get("/pages/:id", requireRole("admin", "editor"), getAdminPageById);
router.put("/pages/:id", requireRole("admin", "editor"), updatePage);
router.delete("/pages/:id", requireRole("admin", "editor"), deletePage);

router.get("/media", requireRole("admin", "editor"), getMediaList);
router.post("/media/upload", requireRole("admin", "editor"), memoryUpload.any(), uploadMedia);
router.put("/media/:id/alt", requireRole("admin", "editor"), updateMediaAlt);
router.delete("/media/:id", requireRole("admin", "editor"), deleteMedia);

router.get("/redirects", requireRole("admin", "editor"), getRedirects);
router.post("/redirects", requireRole("admin", "editor"), createRedirect);
router.put("/redirects/:id", requireRole("admin", "editor"), updateRedirect);
router.delete("/redirects/:id", requireRole("admin", "editor"), deleteRedirect);

router.get("/activity-logs", requireRole("admin", "editor"), getActivityLogs);

// Admin-ONLY restricted routes (Settings & User Management)
router.get("/settings", requireRole("admin"), getAdminSettings);
router.put("/settings", requireRole("admin"), updateSettings);

router.get("/users", requireRole("admin"), getUsers);
router.post("/users", requireRole("admin"), createUser);
router.put("/users/:id", requireRole("admin"), updateUser);
router.delete("/users/:id", requireRole("admin"), deleteUser);

export default router;
