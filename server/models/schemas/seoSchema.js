import mongoose from "mongoose";

export const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, default: "", trim: true },
    metaDescription: { type: String, default: "", trim: true },
    focusKeyword: { type: String, default: "", trim: true },
    canonicalUrl: { type: String, default: "", trim: true },
    ogTitle: { type: String, default: "", trim: true },
    ogDescription: { type: String, default: "", trim: true },
    ogImage: { type: String, default: "", trim: true },
    noindex: { type: Boolean, default: false },
    nofollow: { type: Boolean, default: false },
  },
  { _id: false }
);
