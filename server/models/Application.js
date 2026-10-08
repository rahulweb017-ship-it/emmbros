import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    resume: {
      url: { type: String, required: true },
      filename: { type: String, required: true },
      mimeType: { type: String, default: "" },
      size: { type: Number, default: 0 },
    },
    coverNote: { type: String, default: "", trim: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    status: {
      type: String,
      enum: ["new", "reviewed", "shortlisted", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, createdAt: -1 });

export const Application = mongoose.model("Application", applicationSchema);
