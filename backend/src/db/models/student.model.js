import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    rollNumber: { type: String, required: true, unique: true, index: true },
    isSelected: { type: Boolean, default: false },
    email: { type: String, required: true, lowercase: true, trim: true },
    marks: {
      ideation: { type: Number, default: null },
      execution: { type: Number, default: null },
      viva_pitch: { type: Number, default: null }
    }
  },
  { timestamps: true }
);

// Ensure unique index
studentSchema.index({ rollNumber: 1 }, { unique: true });

const Student = mongoose.model("Student", studentSchema);
export default Student;