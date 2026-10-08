import fs from "node:fs";
import path from "node:path";
import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { applicationZodSchema } from "../utils/validators.js";
import { sendJobApplicationNotification } from "../services/emailService.js";
import { UPLOADS_DIR } from "./mediaController.js";

const RESUMES_DIR = path.join(UPLOADS_DIR, "resumes");
if (!fs.existsSync(RESUMES_DIR)) {
  fs.mkdirSync(RESUMES_DIR, { recursive: true });
}

// Public: Submit job application for a specific job slug
export async function submitApplication(req, res, next) {
  try {
    const job = await Job.findOne({ slug: req.params.slug });
    if (!job) {
      return res.status(404).json({ ok: false, error: "Job posting not found." });
    }

    if (job.status !== "open" || (job.applyByDate && new Date(job.applyByDate) < new Date())) {
      return res.status(400).json({ ok: false, error: "This job posting is closed or expired." });
    }

    const validatedData = applicationZodSchema.parse(req.body);

    const file = req.file || (req.files && req.files[0]);
    if (!file) {
      return res.status(400).json({ ok: false, error: "Resume file (PDF or DOC/DOCX) is required." });
    }

    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/octet-stream",
    ];
    const allowedExts = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExts.includes(ext) && !allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        ok: false,
        error: "Invalid file format. Only PDF, DOC, and DOCX resume files are accepted.",
      });
    }

    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        ok: false,
        error: "Resume file size exceeds the 5 MB maximum limit.",
      });
    }

    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const targetPath = path.join(RESUMES_DIR, uniqueFilename);

    if (file.buffer) {
      fs.writeFileSync(targetPath, file.buffer);
    } else if (file.path) {
      fs.copyFileSync(file.path, targetPath);
    }

    const resumeUrl = `/uploads/resumes/${uniqueFilename}`;

    const application = new Application({
      ...validatedData,
      job: job._id,
      resume: {
        url: resumeUrl,
        filename: file.originalname,
        mimeType: file.mimetype || "application/pdf",
        size: file.size,
      },
    });

    await application.save();

    // Trigger email notification to admin
    await sendJobApplicationNotification({ job, application });

    res.status(201).json({
      ok: true,
      data: application,
      message: "Application submitted successfully!",
    });
  } catch (err) {
    next(err);
  }
}

// Admin: Get applications for a specific job
export async function getJobApplications(req, res, next) {
  try {
    const { jobId } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const query = { job: jobId };
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.q) {
      const searchRegex = new RegExp(req.query.q.trim(), "i");
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const [applications, total, job] = await Promise.all([
      Application.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Application.countDocuments(query),
      Job.findById(jobId).select("title department location status"),
    ]);

    res.json({
      ok: true,
      job,
      data: applications,
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

// Admin: Get all applications across jobs
export async function getAllApplications(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.q) {
      const searchRegex = new RegExp(req.query.q.trim(), "i");
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const [applications, total] = await Promise.all([
      Application.find(query).populate("job", "title department location").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Application.countDocuments(query),
    ]);

    res.json({
      ok: true,
      data: applications,
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

// Admin: Update application status
export async function updateApplicationStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowedStatuses = ["new", "reviewed", "shortlisted", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ ok: false, error: "Invalid application status value." });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ ok: false, error: "Application not found." });
    }

    res.json({ ok: true, data: application });
  } catch (err) {
    next(err);
  }
}

// Admin: Delete application
export async function deleteApplication(req, res, next) {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ ok: false, error: "Application not found." });
    }

    // Try deleting resume file from disk
    if (application.resume?.url) {
      const filename = path.basename(application.resume.url);
      const filePath = path.join(RESUMES_DIR, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ ok: true, message: "Application deleted successfully." });
  } catch (err) {
    next(err);
  }
}
