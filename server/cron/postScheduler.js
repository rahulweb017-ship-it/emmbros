import cron from "node-cron";
import { Post } from "../models/Post.js";
import { Job } from "../models/Job.js";

export function initScheduledPostCron() {
  // Check every minute for:
  // 1. Scheduled posts whose publishedAt date has arrived
  // 2. Open jobs whose applyByDate has passed
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      // Publish scheduled posts
      const scheduledPosts = await Post.find({
        status: "scheduled",
        publishedAt: { $lte: now },
      });

      if (scheduledPosts.length > 0) {
        for (const post of scheduledPosts) {
          post.status = "published";
          await post.save();
          console.log(`[cron] Automatically published scheduled post: "${post.title}" (${post.slug})`);
        }
      }

      // Close expired jobs
      const expiredJobs = await Job.find({
        status: "open",
        applyByDate: { $lte: now },
      });

      if (expiredJobs.length > 0) {
        for (const job of expiredJobs) {
          job.status = "closed";
          await job.save();
          console.log(`[cron] Automatically closed expired job posting: "${job.title}" (applyByDate: ${job.applyByDate.toISOString()})`);
        }
      }
    } catch (err) {
      console.error("[cron] Error running background cron scheduler:", err.message);
    }
  });

  console.log("[cron] Scheduled post & expired job cron worker initialized (checks every minute).");
}
