import { Page } from "../models/Page.js";
import { DEFAULT_PAGES } from "../config/defaultPages.js";
import { slugify } from "../utils/helpers.js";
import { pageZodSchema, pageUpdateZodSchema } from "../utils/validators.js";

async function generateUniqueSlug(title, currentId = null) {
  let baseSlug = slugify(title) || "page";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Page.findOne({ slug, _id: { $ne: currentId } });
    if (!existing) break;
    slug = `${baseSlug}-${counter++}`;
  }
  return slug;
}

export async function getAdminPages(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.q) {
      const regex = new RegExp(req.query.q.trim(), "i");
      query.$or = [{ title: regex }, { slug: regex }];
    }

    const [pages, total] = await Promise.all([
      Page.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit),
      Page.countDocuments(query),
    ]);

    res.json({
      ok: true,
      data: pages,
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

export async function getAdminPageById(req, res, next) {
  try {
    const pageItem = await Page.findById(req.params.id);
    if (!pageItem) {
      return res.status(404).json({ ok: false, error: "Page not found." });
    }
    res.json({ ok: true, data: pageItem });
  } catch (err) {
    next(err);
  }
}

export async function createPage(req, res, next) {
  try {
    const data = pageZodSchema.parse(req.body);

    const slug = data.slug
      ? await generateUniqueSlug(data.slug)
      : await generateUniqueSlug(data.title);

    const pageItem = new Page({
      ...data,
      slug,
    });

    await pageItem.save();
    res.status(201).json({ ok: true, data: pageItem });
  } catch (err) {
    next(err);
  }
}

export async function updatePage(req, res, next) {
  try {
    const data = pageUpdateZodSchema.parse(req.body);
    const pageItem = await Page.findById(req.params.id);

    if (!pageItem) {
      return res.status(404).json({ ok: false, error: "Page not found." });
    }

    if (data.slug && data.slug !== pageItem.slug) {
      pageItem.slug = await generateUniqueSlug(data.slug, pageItem._id);
    }

    if (data.title !== undefined) pageItem.title = data.title;
    if (data.content !== undefined) pageItem.content = data.content;
    if (data.seo !== undefined) pageItem.seo = { ...pageItem.seo, ...data.seo };

    await pageItem.save();
    res.json({ ok: true, data: pageItem });
  } catch (err) {
    next(err);
  }
}

export async function deletePage(req, res, next) {
  try {
    const pageItem = await Page.findByIdAndDelete(req.params.id);
    if (!pageItem) {
      return res.status(404).json({ ok: false, error: "Page not found." });
    }
    res.json({ ok: true, message: "Page deleted successfully." });
  } catch (err) {
    next(err);
  }
}

export async function syncDefaultPages(req, res, next) {
  try {
    let syncedCount = 0;
    for (const defPage of DEFAULT_PAGES) {
      const existing = await Page.findOne({ slug: defPage.slug });
      if (!existing) {
        await Page.create(defPage);
        syncedCount++;
      }
    }
    const total = await Page.countDocuments();
    res.json({
      ok: true,
      message: `Sync completed. ${syncedCount} new page(s) inserted. Total: ${total} pages.`,
      syncedCount,
      total,
    });
  } catch (err) {
    next(err);
  }
}

export async function getPublicPageBySlug(req, res, next) {
  try {
    const pageItem = await Page.findOne({ slug: req.params.slug });
    if (!pageItem) {
      return res.status(404).json({ ok: false, error: "Page not found." });
    }
    res.json({ ok: true, data: pageItem });
  } catch (err) {
    next(err);
  }
}
