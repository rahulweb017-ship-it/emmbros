import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

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
