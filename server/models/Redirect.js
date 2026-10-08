import mongoose from "mongoose";

const redirectSchema = new mongoose.Schema(
  {
    fromUrl: { type: String, required: true, unique: true, trim: true, lowercase: true },
    toUrl: { type: String, required: true, trim: true },
    statusCode: { type: Number, default: 301, enum: [301, 302] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

redirectSchema.index({ fromUrl: 1, active: 1 });

export const Redirect = mongoose.model("Redirect", redirectSchema);
