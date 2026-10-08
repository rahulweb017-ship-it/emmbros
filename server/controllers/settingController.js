import { Setting } from "../models/Setting.js";
import { ActivityLog, logActivity } from "../models/ActivityLog.js";

// Helper to get or create single settings document
async function getOrCreateSettings() {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  return settings;
}

// Public: Get site settings (used by header, footer, meta injection)
export async function getPublicSettings(req, res, next) {
  try {
    const settings = await getOrCreateSettings();
    // Exclude private script keys if needed, or return clean settings
    res.json({
      ok: true,
      data: {
        siteName: settings.siteName,
        tagline: settings.tagline,
        logo: settings.logo,
        favicon: settings.favicon,
        contactDetails: settings.contactDetails,
        socialLinks: settings.socialLinks,
        defaultSeoTitleTemplate: settings.defaultSeoTitleTemplate,
        defaultOgImage: settings.defaultOgImage,
        googleAnalyticsId: settings.googleAnalyticsId,
        searchConsoleCode: settings.searchConsoleCode,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Admin: Get all site settings (including custom scripts)
export async function getAdminSettings(req, res, next) {
  try {
    const settings = await getOrCreateSettings();
    res.json({ ok: true, data: settings });
  } catch (err) {
    next(err);
  }
}

// Admin: Update site settings (Admin role only)
export async function updateSettings(req, res, next) {
  try {
    const settings = await getOrCreateSettings();
    const data = req.body;

    if (data.siteName !== undefined) settings.siteName = data.siteName;
    if (data.tagline !== undefined) settings.tagline = data.tagline;
    if (data.logo !== undefined) settings.logo = data.logo;
    if (data.favicon !== undefined) settings.favicon = data.favicon;
    if (data.contactDetails !== undefined) settings.contactDetails = { ...settings.contactDetails, ...data.contactDetails };
    if (data.socialLinks !== undefined) settings.socialLinks = { ...settings.socialLinks, ...data.socialLinks };
    if (data.defaultSeoTitleTemplate !== undefined) settings.defaultSeoTitleTemplate = data.defaultSeoTitleTemplate;
    if (data.defaultOgImage !== undefined) settings.defaultOgImage = data.defaultOgImage;
    if (data.googleAnalyticsId !== undefined) settings.googleAnalyticsId = data.googleAnalyticsId;
    if (data.searchConsoleCode !== undefined) settings.searchConsoleCode = data.searchConsoleCode;
    if (data.customHeadScripts !== undefined) settings.customHeadScripts = data.customHeadScripts;
    if (data.customFooterScripts !== undefined) settings.customFooterScripts = data.customFooterScripts;

    await settings.save();

    await logActivity({
      req,
      action: "updated_settings",
      targetType: "setting",
      targetId: settings._id.toString(),
      details: "Updated site configuration and contact settings",
    });

    res.json({ ok: true, data: settings });
  } catch (err) {
    next(err);
  }
}

// Admin: Get activity log feed for Dashboard
export async function getActivityLogs(req, res, next) {
  try {
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 15));
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(limit);
    res.json({ ok: true, data: logs });
  } catch (err) {
    next(err);
  }
}
