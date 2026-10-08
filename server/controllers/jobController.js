import { Job } from "../models/Job.js";
import { slugify, sanitizeContent } from "../utils/helpers.js";
import { jobZodSchema, jobUpdateZodSchema } from "../utils/validators.js";

async function generateUniqueSlug(title, currentId = null) {
  let baseSlug = slugify(title) || "job";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Job.findOne({ slug, _id: { $ne: currentId } });
    if (!existing) break;
    slug = `${baseSlug}-${counter++}`;
  }
  return slug;
}

// Admin: Get all jobs (paginated, search, status filter)
export async function getAdminJobs(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.q) {
      const searchRegex = new RegExp(req.query.q.trim(), "i");
      query.$or = [{ title: searchRegex }, { department: searchRegex }, { location: searchRegex }];
    }

    const [jobs, total] = await Promise.all([
      Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments(query),
    ]);

    res.json({
      ok: true,
      data: jobs,
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

// Admin: Get job by ID
export async function getAdminJobById(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ ok: false, error: "Job posting not found." });
    }
    res.json({ ok: true, data: job });
  } catch (err) {
    next(err);
  }
}

// Admin: Create job
export async function createJob(req, res, next) {
  try {
    const data = jobZodSchema.parse(req.body);

    const slug = data.slug
      ? await generateUniqueSlug(data.slug)
      : await generateUniqueSlug(data.title);

    const sanitizedDescription = sanitizeContent(data.description);

    const job = new Job({
      ...data,
      slug,
      description: sanitizedDescription,
    });

    await job.save();
    res.status(201).json({ ok: true, data: job });
  } catch (err) {
    next(err);
  }
}

// Admin: Update job
export async function updateJob(req, res, next) {
  try {
    const data = jobUpdateZodSchema.parse(req.body);
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ ok: false, error: "Job posting not found." });
    }

    if (data.slug && data.slug !== job.slug) {
      job.slug = await generateUniqueSlug(data.slug, job._id);
    }

    if (data.title !== undefined) job.title = data.title;
    if (data.department !== undefined) job.department = data.department;
    if (data.location !== undefined) job.location = data.location;
    if (data.employmentType !== undefined) job.employmentType = data.employmentType;
    if (data.experience !== undefined) job.experience = data.experience;
    if (data.salaryRange !== undefined) job.salaryRange = data.salaryRange;
    if (data.description !== undefined) job.description = sanitizeContent(data.description);
    if (data.responsibilities !== undefined) job.responsibilities = data.responsibilities;
    if (data.requirements !== undefined) job.requirements = data.requirements;
    if (data.applyByDate !== undefined) job.applyByDate = data.applyByDate;
    if (data.status !== undefined) job.status = data.status;
    if (data.seo !== undefined) job.seo = { ...job.seo, ...data.seo };

    await job.save();
    res.json({ ok: true, data: job });
  } catch (err) {
    next(err);
  }
}

// Admin: Delete job
export async function deleteJob(req, res, next) {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ ok: false, error: "Job posting not found." });
    }
    res.json({ ok: true, message: "Job posting deleted successfully." });
  } catch (err) {
    next(err);
  }
}

// Public: Get open jobs
export async function getPublicJobs(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const query = { status: "open" };
    if (req.query.department) query.department = req.query.department;
    if (req.query.search) {
      const regex = new RegExp(req.query.search.trim(), "i");
      query.$or = [{ title: regex }, { department: regex }, { location: regex }];
    }

    const [jobs, total] = await Promise.all([
      Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments(query),
    ]);

    res.json({
      ok: true,
      data: jobs,
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

// Public: Get open job by slug
export async function getPublicJobBySlug(req, res, next) {
  try {
    const job = await Job.findOne({ slug: req.params.slug, status: "open" });
    if (!job) {
      return res.status(404).json({ ok: false, error: "Job posting not found or no longer open." });
    }
    res.json({ ok: true, data: job });
  } catch (err) {
    next(err);
  }
}
