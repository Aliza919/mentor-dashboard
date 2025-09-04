import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) throw new Error("MONGODB_URI is missing");
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected");

  // Graceful shutdown
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🔌 MongoDB disconnected");
    process.exit(0);
  });
}