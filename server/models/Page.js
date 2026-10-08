import mongoose from "mongoose";
import { seoSchema } from "./schemas/seoSchema.js";

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: mongoose.Schema.Types.Mixed, default: "" },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true }
);



export const Page = mongoose.model("Page", pageSchema);
