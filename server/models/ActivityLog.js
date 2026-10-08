import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: { type: String, default: "System" },
    userEmail: { type: String, default: "" },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: String, default: "" },
    details: { type: String, default: "" },
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export async function logActivity({ req, user, action, targetType, targetId = "", details = "" }) {
  try {
    const activeUser = user || req?.user;
    await ActivityLog.create({
      user: activeUser?._id || activeUser?.userId || null,
      userName: activeUser?.name || activeUser?.email || "System",
      userEmail: activeUser?.email || "",
      action,
      targetType,
      targetId,
      details,
    });
  } catch (err) {
    console.error("[activityLog] Failed to log activity:", err.message);
  }
}
