import express from "express";
import Student from "../db/models/student.model.js";
import MentorState from "../db/models/mentorState.model.js";

const router = express.Router();

async function getMentor() {
  const existing = await MentorState.findOne({ mentorKey: "default" });
  if (existing) return existing;
  return MentorState.create({ mentorKey: "default" });
}

/** GET student pool */
router.get("/", async (_req, res) => {
  try {
    const students = await Student.find().lean();
    res.json(students);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** GET mentor state arrays */
router.get("/state", async (_req, res) => {
  try {
    const state = await getMentor();
    res.json(state);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** POST addStudent: set isSelected, push to selectedStudent */
router.post("/:rollNumber/add", async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const state = await getMentor();

    const currentBatchCount =
      state.activeStudents.length +
      state.selectedStudent.length +
      state.assignedStudents.length;

    if (currentBatchCount >= 4) {
      return res.status(400).json({ error: "You cannot have more than 4 students at a time." });
    }

    const student = await Student.findOne({ rollNumber });
    if (!student) return res.status(404).json({ error: "Student not found" });

    student.isSelected = true;
    await student.save();

    if (!state.selectedStudent.includes(rollNumber)) {
      state.selectedStudent.push(rollNumber);
      await state.save();
    }

    res.json({ ok: true, state, student });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** DELETE removeStudent: unset isSelected, remove from arrays */
router.delete("/:rollNumber/remove", async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const state = await getMentor();

    const student = await Student.findOne({ rollNumber });
    if (!student) return res.status(404).json({ error: "Student not found" });

    student.isSelected = false;
    await student.save();

    state.activeStudents = state.activeStudents.filter(r => r !== rollNumber);
    state.selectedStudent = state.selectedStudent.filter(r => r !== rollNumber);
    await state.save();

    res.json({ ok: true, state, student });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** POST activateStudent: selected -> active (3..4 guard) */
router.post("/activate", async (_req, res) => {
  try {
    const state = await getMentor();
    const batchSize = state.selectedStudent.length;

    if (batchSize < 3) {
      return res.status(400).json({ error: `Need at least 3 students (currently ${batchSize}).` });
    }
    if (batchSize > 4) {
      return res.status(400).json({ error: "Cannot exceed 4 students in a batch." });
    }

    state.activeStudents.push(...state.selectedStudent);
    state.selectedStudent = [];
    await state.save();

    res.json({ ok: true, state });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** PATCH setMarks: update one field */
router.patch("/:rollNumber/marks", async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const { field, value } = req.body;
    const allowed = ["ideation", "execution", "viva_pitch"];

    if (!allowed.includes(field)) {
      return res.status(400).json({ error: `field must be one of ${allowed.join(", ")}` });
    }
    if (!(typeof value === "number" || value === null)) {
      return res.status(400).json({ error: "value must be a number or null" });
    }

    const doc = await Student.findOneAndUpdate(
      { rollNumber },
      { $set: { [`marks.${field}`]: value } },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ error: "Student not found" });

    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** POST markStudentAsEvaluated: active -> assigned */
router.post("/:rollNumber/evaluated", async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const state = await getMentor();

    if (!state.activeStudents.includes(rollNumber)) {
      return res.status(400).json({ error: "Student is not active" });
    }

    state.activeStudents = state.activeStudents.filter(r => r !== rollNumber);
    if (!state.assignedStudents.includes(rollNumber)) {
      state.assignedStudents.push(rollNumber);
    }
    await state.save();

    res.json({ ok: true, state });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** POST finalize: assigned -> finalized */
router.post("/finalize", async (_req, res) => {
  try {
    const state = await getMentor();

    state.finalizedStudents.push(...state.assignedStudents);
    state.assignedStudents = [];
    await state.save();

    res.json({ ok: true, state });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;