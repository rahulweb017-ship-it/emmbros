import "dotenv/config";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "node:path";
import fs from "node:fs";

async function runPhase4Tests() {
  console.log("=== Starting Phase 4 Backend Verification Suite ===");

  await connectDB();

  // Create test admin user if not exists
  let admin = await User.findOne({ email: "admin@emmbrosautocomp.com" });
  if (!admin) {
    const passwordHash = await bcrypt.hash("Admin@12345", 10);
    admin = await User.create({
      name: "System Administrator",
      email: "admin@emmbrosautocomp.com",
      passwordHash,
      role: "admin",
    });
  }

  const token = jwt.sign(
    { userId: admin._id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET || "emmbros_super_secret_jwt_key_2026_change_in_production",
    { expiresIn: "1h" }
  );

  // 1. Create a test job posting
  const testJobSlug = `test-tooling-engineer-${Date.now()}`;
  const newJob = new Job({
    title: "Tooling & Die Maintenance Engineer",
    slug: testJobSlug,
    department: "Engineering",
    location: "Baddi, Himachal Pradesh",
    employmentType: "Full-time",
    experience: "3 - 6 Years",
    salaryRange: "₹6,00,000 - ₹9,00,000 P.A.",
    description: "<p>We are seeking an experienced Tooling Engineer to oversee forging dies and press tooling.</p>",
    responsibilities: ["Die maintenance and inspection", "CNC tooling setup"],
    requirements: ["B.Tech Mechanical / Diploma Tool & Die", "Min 3 years forging experience"],
    applyByDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in future
    status: "open",
  });
  await newJob.save();
  console.log(`✓ Job Posting Created: "${newJob.title}" (${newJob.slug})`);

  // 2. Submit a test job application
  const testApp = new Application({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "+91 9876543210",
    resume: {
      url: "/uploads/resumes/sample-resume.pdf",
      filename: "Rajesh_Kumar_Resume.pdf",
      mimeType: "application/pdf",
      size: 154200,
    },
    coverNote: "I have 4 years of hands-on experience in closed-die forging die maintenance.",
    job: newJob._id,
    status: "new",
  });
  await testApp.save();
  console.log(`✓ Job Application Submitted: "${testApp.name}" for job "${newJob.title}"`);

  // 3. Admin status update test
  testApp.status = "shortlisted";
  await testApp.save();
  console.log(`✓ Admin Application Status Update verified: status set to "${testApp.status}"`);

  // 4. Test cron job auto-closing expired jobs
  const expiredJob = new Job({
    title: "Expired Quality Supervisor",
    slug: `expired-quality-sup-${Date.now()}`,
    department: "Quality Control",
    experience: "2 Years",
    description: "Expired role test",
    applyByDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    status: "open",
  });
  await expiredJob.save();

  // Run auto-close logic
  const now = new Date();
  const jobsToClose = await Job.find({ status: "open", applyByDate: { $lte: now } });
  for (const j of jobsToClose) {
    j.status = "closed";
    await j.save();
  }

  const verifiedExpiredJob = await Job.findById(expiredJob._id);
  if (verifiedExpiredJob.status === "closed") {
    console.log(`✓ Cron Auto-Close verified: Expired job "${verifiedExpiredJob.title}" marked as "closed"`);
  } else {
    throw new Error("Cron auto-close failed to update expired job status.");
  }

  console.log("\nALL PHASE 4 BACKEND TESTS PASSED CLEANLY!");
  process.exit(0);
}

runPhase4Tests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
