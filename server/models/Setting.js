import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Emmbros Autocomp Ltd", trim: true },
    tagline: { type: String, default: "Leading Automotive Forging Manufacturer", trim: true },
    logo: { type: String, default: "/wp-content/uploads/2025/12/logo1.webp", trim: true },
    favicon: { type: String, default: "/favicon.ico", trim: true },
    contactDetails: {
      address: { type: String, default: "Plot No 46, Phase 1, Baddi, Himachal Pradesh 173205, India", trim: true },
      phone: { type: String, default: "+91-1795-244500", trim: true },
      secondaryPhone: { type: String, default: "+91-1795-244501", trim: true },
      email: { type: String, default: "enquiry@emmbros.com", trim: true },
    },
    socialLinks: {
      facebook: { type: String, default: "", trim: true },
      linkedin: { type: String, default: "", trim: true },
      twitter: { type: String, default: "", trim: true },
      youtube: { type: String, default: "", trim: true },
      instagram: { type: String, default: "", trim: true },
    },
    defaultSeoTitleTemplate: { type: String, default: "%title% | Emmbros Autocomp Ltd", trim: true },
    defaultOgImage: { type: String, default: "/wp-content/uploads/2025/12/logo1.webp", trim: true },
    googleAnalyticsId: { type: String, default: "", trim: true },
    searchConsoleCode: { type: String, default: "", trim: true },
    customHeadScripts: { type: String, default: "" },
    customFooterScripts: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Setting = mongoose.model("Setting", settingSchema);
