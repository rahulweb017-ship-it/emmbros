import mongoose from "mongoose";
import { seoSchema } from "./schemas/seoSchema.js";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: "", trim: true },
    content: { type: String, required: true },
    featuredImage: {
      url: { type: String, default: "" },
      alt: { type: String, default: "" },
    },
    category: { type: String, default: "General", trim: true },
    tags: [{ type: String, trim: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["draft", "published", "scheduled"], default: "draft" },
    publishedAt: { type: Date },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true }
);

postSchema.index({ status: 1, publishedAt: -1 });

export const Post = mongoose.model("Post", postSchema);
