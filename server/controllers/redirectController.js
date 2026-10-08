import { Redirect } from "../models/Redirect.js";

// Admin: Get all redirects
export async function getRedirects(req, res, next) {
  try {
    const redirects = await Redirect.find().sort({ createdAt: -1 });
    res.json({ ok: true, data: redirects });
  } catch (err) {
    next(err);
  }
}

// Admin: Create redirect
export async function createRedirect(req, res, next) {
  try {
    let { fromUrl, toUrl, statusCode, active } = req.body;
    if (!fromUrl || !toUrl) {
      return res.status(400).json({ ok: false, error: "fromUrl and toUrl are required." });
    }

    if (!fromUrl.startsWith("/")) fromUrl = "/" + fromUrl;

    const redirect = new Redirect({
      fromUrl: fromUrl.toLowerCase().trim(),
      toUrl: toUrl.trim(),
      statusCode: statusCode ? parseInt(statusCode, 10) : 301,
      active: active !== undefined ? Boolean(active) : true,
    });

    await redirect.save();
    res.status(201).json({ ok: true, data: redirect });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ ok: false, error: "A redirect for this fromUrl already exists." });
    }
    next(err);
  }
}

// Admin: Update redirect
export async function updateRedirect(req, res, next) {
  try {
    const { fromUrl, toUrl, statusCode, active } = req.body;
    const redirect = await Redirect.findById(req.params.id);
    if (!redirect) {
      return res.status(404).json({ ok: false, error: "Redirect not found." });
    }

    if (fromUrl !== undefined) {
      let formattedFrom = fromUrl.trim();
      if (!formattedFrom.startsWith("/")) formattedFrom = "/" + formattedFrom;
      redirect.fromUrl = formattedFrom.toLowerCase();
    }
    if (toUrl !== undefined) redirect.toUrl = toUrl.trim();
    if (statusCode !== undefined) redirect.statusCode = parseInt(statusCode, 10);
    if (active !== undefined) redirect.active = Boolean(active);

    await redirect.save();
    res.json({ ok: true, data: redirect });
  } catch (err) {
    next(err);
  }
}

// Admin: Delete redirect
export async function deleteRedirect(req, res, next) {
  try {
    const redirect = await Redirect.findByIdAndDelete(req.params.id);
    if (!redirect) {
      return res.status(404).json({ ok: false, error: "Redirect not found." });
    }
    res.json({ ok: true, message: "Redirect deleted successfully." });
  } catch (err) {
    next(err);
  }
}
