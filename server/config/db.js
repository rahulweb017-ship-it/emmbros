import mongoose from "mongoose";
import { ensureAdminSeeded, ensurePagesSeeded, ensurePostsSeeded } from "./seedOnStart.js";

let memoryServer = null;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri && uri !== "memory") {
      await mongoose.connect(uri);
      console.log(`[db] Connected to MongoDB at ${uri.replace(/:[^:@]+@/, ":****@")}`);
    } else {
      console.log("[db] MONGODB_URI not provided or set to 'memory'. Starting in-memory MongoDB server...");
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[db] Connected to in-memory MongoDB at ${memoryUri}`);
    }

    // Automatically ensure initial admin user and default pages are seeded
    await ensureAdminSeeded();
    await ensurePagesSeeded();
    await ensurePostsSeeded();
  } catch (err) {
    console.error("[db] MongoDB connection error:", err.message);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
}
