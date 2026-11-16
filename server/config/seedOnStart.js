import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Page } from "../models/Page.js";
import { Post } from "../models/Post.js";
import { DEFAULT_PAGES } from "./defaultPages.js";
import { DEFAULT_POSTS } from "./defaultPosts.js";

export async function ensureAdminSeeded() {
  try {
    const email = (process.env.ADMIN_EMAIL || "admin@emmbrosautocomp.com").toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || "Admin@12345";
    const name = process.env.ADMIN_NAME || "System Administrator";

    let admin = await User.findOne({ email });

    if (!admin) {
      const passwordHash = await bcrypt.hash(password, 10);
      admin = await User.create({
        name,
        email,
        passwordHash,
        role: "admin",
      });
      console.log(`[seed] Automatically seeded initial admin user: ${email}`);
    }
  } catch (err) {
    console.error("[seed] Auto-seed check failed:", err.message);
  }
}

export async function ensurePagesSeeded() {
  try {
    const count = await Page.countDocuments();
    if (count === 0) {
      console.log("[seed] Seeding default website pages and SEO configurations...");
      await Page.insertMany(DEFAULT_PAGES);
      console.log(`[seed] Successfully seeded ${DEFAULT_PAGES.length} website pages into database.`);
    }
  } catch (err) {
    console.error("[seed] Error seeding default pages:", err.message);
  }
}

export async function ensurePostsSeeded() {
  try {
    const count = await Post.countDocuments();
    if (count === 0) {
      console.log("[seed] Seeding initial published technical blog articles...");
      const admin = await User.findOne({ role: "admin" });
      const postsWithAuthor = DEFAULT_POSTS.map((p) => ({
        ...p,
        author: admin ? admin._id : undefined,
      }));
      await Post.insertMany(postsWithAuthor);
      console.log(`[seed] Successfully seeded ${DEFAULT_POSTS.length} blog articles into database.`);
    }
  } catch (err) {
    console.error("[seed] Error seeding default posts:", err.message);
  }
}
