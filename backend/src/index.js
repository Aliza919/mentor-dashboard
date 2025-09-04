import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db/db.js";
import studentsRouter from "./routes/students.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/students", studentsRouter);

const PORT = process.env.PORT || 4000;

(async () => {
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
})();