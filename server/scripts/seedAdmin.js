import "dotenv/config";
import { connectDB, disconnectDB } from "../config/db.js";
import { User } from "../models/User.js";

async function seedAdmin() {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || "admin@emmbrosautocomp.com").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";
  const name = process.env.ADMIN_NAME || "System Administrator";

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log(`[seed] Admin user with email "${email}" already exists. Updating role to admin...`);
      existingUser.role = "admin";
      existingUser.passwordHash = await User.hashPassword(password);
      await existingUser.save();
      console.log(`[seed] Updated admin password and role for "${email}".`);
    } else {
      const passwordHash = await User.hashPassword(password);
      const adminUser = new User({
        name,
        email,
        passwordHash,
        role: "admin",
      });
      await adminUser.save();
      console.log(`[seed] Created new admin user: ${email} (${adminUser._id})`);
    }
  } catch (err) {
    console.error("[seed] Error seeding admin user:", err.message);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

seedAdmin();
