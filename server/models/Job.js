import mongoose from "mongoose";
import { seoSchema } from "./schemas/seoSchema.js";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    department: { type: String, required: true, trim: true },
    location: { type: String, default: "Baddi, Himachal Pradesh", trim: true },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    experience: { type: String, required: true, trim: true },
    salaryRange: { type: String, default: "", trim: true },
    description: { type: String, required: true },
    responsibilities: [{ type: String, trim: true }],
    requirements: [{ type: String, trim: true }],
    applyByDate: { type: Date },
    status: { type: String, enum: ["open", "closed", "draft"], default: "open" },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true }
);

jobSchema.index({ status: 1, createdAt: -1 });

export const Job = mongoose.model("Job", jobSchema);
