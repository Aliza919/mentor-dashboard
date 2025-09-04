import mongoose from "mongoose";

const mentorStateSchema = new mongoose.Schema(
  {
    mentorKey: { type: String, required: true, unique: true, default: "default" },
    selectedStudent: { type: [String], default: [] },
    activeStudents: { type: [String], default: [] },
    assignedStudents: { type: [String], default: [] },
    finalizedStudents: { type: [String], default: [] }
  },
  { timestamps: true }
);

const MentorState = mongoose.model("MentorState", mentorStateSchema);
export default MentorState;