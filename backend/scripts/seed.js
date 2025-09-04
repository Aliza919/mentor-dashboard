import "dotenv/config";
import mongoose from "mongoose";
import Student from "../src/db/models/student.model.js";

const data = [
  {
    rollNumber: "22BCS0001",
    email: "a@b.com",
    isSelected: false,
    marks: { ideation: null, execution: null, viva_pitch: null }
  },
  {
    rollNumber: "22BCS0002",
    email: "b@b.com",
    isSelected: false,
    marks: { ideation: null, execution: null, viva_pitch: null }
  },
  {
    rollNumber: "22BCS0003",
    email: "c@b.com",
    isSelected: false,
    marks: { ideation: null, execution: null, viva_pitch: null }
  }
];

async function run() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected");

  for (const s of data) {
    await Student.updateOne(
      { rollNumber: s.rollNumber },
      { $setOnInsert: s },
      { upsert: true }
    );
  }

  console.log(`🌱 Seeded ${data.length} students (upserted)`);
  await mongoose.connection.close();
  console.log("🔌 Disconnected");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});