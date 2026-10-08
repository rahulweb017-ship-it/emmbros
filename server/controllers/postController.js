import { Post } from "../models/Post.js";
import { slugify, sanitizeContent } from "../utils/helpers.js";
import { postZodSchema, postUpdateZodSchema } from "../utils/validators.js";

async function generateUniqueSlug(title, currentId = null) {
  let baseSlug = slugify(title) || "post";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Post.findOne({ slug, _id: { $ne: currentId } });
    if (!existing) break;
    slug = `${baseSlug}-${counter++}`;
  }
  return slug;
}

// Admin: Get all posts (paginated, search, status filter)
export async function getAdminPosts(req, res, next) {
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
      query.$or = [{ title: searchRegex }, { excerpt: searchRegex }, { category: searchRegex }];
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate("author", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(query),
    ]);

    res.json({
      ok: true,
      data: posts,
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

// Admin: Get post by ID
export async function getAdminPostById(req, res, next) {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name email");
    if (!post) {
      return res.status(404).json({ ok: false, error: "Post not found." });
    }
    res.json({ ok: true, data: post });
  } catch (err) {
    next(err);
  }
}

// Admin: Create post
export async function createPost(req, res, next) {
  try {
    const data = postZodSchema.parse(req.body);

    const slug = data.slug
      ? await generateUniqueSlug(data.slug)
      : await generateUniqueSlug(data.title);

    const sanitizedHtml = sanitizeContent(data.content);

    const post = new Post({
      ...data,
      slug,
      content: sanitizedHtml,
      author: req.user?._id,
      publishedAt: data.status === "published" ? data.publishedAt || new Date() : data.publishedAt,
    });

    await post.save();
    res.status(201).json({ ok: true, data: post });
  } catch (err) {
    next(err);
  }
}

// Admin: Update post
export async function updatePost(req, res, next) {
  try {
    const data = postUpdateZodSchema.parse(req.body);
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ ok: false, error: "Post not found." });
    }

    if (data.slug && data.slug !== post.slug) {
      post.slug = await generateUniqueSlug(data.slug, post._id);
    } else if (data.title && !data.slug) {
      // keep current slug unless explicitly updating title & requested change
    }

    if (data.title !== undefined) post.title = data.title;
    if (data.excerpt !== undefined) post.excerpt = data.excerpt;
    if (data.content !== undefined) post.content = sanitizeContent(data.content);
    if (data.featuredImage !== undefined) post.featuredImage = data.featuredImage;
    if (data.category !== undefined) post.category = data.category;
    if (data.tags !== undefined) post.tags = data.tags;
    if (data.status !== undefined) {
      post.status = data.status;
      if (data.status === "published" && !post.publishedAt) {
        post.publishedAt = new Date();
      }
    }
    if (data.publishedAt !== undefined) post.publishedAt = data.publishedAt;
    if (data.seo !== undefined) post.seo = { ...post.seo, ...data.seo };

    await post.save();
    res.json({ ok: true, data: post });
  } catch (err) {
    next(err);
  }
}

// Admin: Delete post
export async function deletePost(req, res, next) {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ ok: false, error: "Post not found." });
    }
    res.json({ ok: true, message: "Post deleted successfully." });
  } catch (err) {
    next(err);
  }
}

// Public: Get published posts
export async function getPublicPosts(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const query = { status: "published" };
    if (req.query.category) query.category = req.query.category;
    if (req.query.search) {
      const regex = new RegExp(req.query.search.trim(), "i");
      query.$or = [{ title: regex }, { excerpt: regex }];
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .select("-content")
        .populate("author", "name")
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(query),
    ]);

    res.json({
      ok: true,
      data: posts,
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

// Public: Get published post by slug
export async function getPublicPostBySlug(req, res, next) {
  try {
    const post = await Post.findOne({ slug: req.params.slug, status: "published" }).populate("author", "name");
    if (!post) {
      return res.status(404).json({ ok: false, error: "Post not found or not published." });
    }
    res.json({ ok: true, data: post });
  } catch (err) {
    next(err);
  }
}
