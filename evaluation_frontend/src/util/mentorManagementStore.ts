import { create } from "zustand";
import type studentType from "../types/student";
import { api, type MarkField } from "../lib/api";
import StudentPool from "../components/StudentPool";

interface mentor {
  studentPool: studentType[];
  selectedStudent: string[];
  activeStudents: string[];
  assignedStudents: string[];
  finalizedStudents: string[];
  error: string;
  clearError: () => void;
  addStudent: (rollNumber: string) => void;
  removeStudent: (rollNumber: string, idx: number) => void;
  activateStudent: () => void;
  setMarks: (
    rollNumber: string,
    field: keyof studentType["marks"],
    value: number | null
  ) => void;
  markStudentAsEvaluated: (rollNumber: string) => void;
  setFinalizedStudent: () => void;


  hydrate: () => Promise<void>;
}

export default create<mentor>((set, get) => ({
  studentPool: [],
  selectedStudent: [],
  activeStudents: [],
  assignedStudents: [],
  finalizedStudents: [],
  error: "",


  clearError: () => set((prev) => ({ ...prev, error: "" })),

  hydrate: async () => {
    try {
      const [pool, state] = await Promise.all([
        api.getStudentPool(),  
        api.getState(),      
      ]);
      set((prev) => ({
        ...prev,
        studentPool: pool,
        selectedStudent: state.selectedStudent ?? [],
        activeStudents: state.activeStudents ?? [],
        assignedStudents: state.assignedStudents ?? [],
        finalizedStudents: state.finalizedStudents ?? [],
        error: "",
      }));
      console.log("successfully hydrated mentor store");
    } catch (e: any) {
      set((prev) => ({ ...prev, error: e?.message ?? "Failed to load" }));
      console.error("failed to hydrate mentor store:", e);
    }
  },

  addStudent: (rollNumber) => {
    const prevState = get();
    set((prev) => {
      const currentBatchCount =
        prev.activeStudents.length +
        prev.selectedStudent.length +
        prev.assignedStudents.length;

      if (currentBatchCount >= 4) {
        return { ...prev, error: "You cannot have more than 4 students at a time." };
      }

      const studentIdx = prev.studentPool.findIndex(
        (curr) => curr.rollNumber === rollNumber
      );
      if (studentIdx === -1) return prev;

      const studentPool = [...prev.studentPool];
      studentPool[studentIdx] = { ...studentPool[studentIdx], isSelected: true };

      return {
        ...prev,
        studentPool,
        selectedStudent: [...prev.selectedStudent, rollNumber],
        error: "",
      };
    });

    api.addStudent(rollNumber).catch((e) => {
  
      set({
        ...prevState,
        error: e?.message ?? "Failed to add student",
      });
    });
  },

  removeStudent: (rollNumber) => {
    const snapshot = get();
    set((prev) => {
      const studentIdx = prev.studentPool.findIndex(
        (curr) => curr.rollNumber === rollNumber
      );
      if (studentIdx === -1) return prev;

      const studentPool = [...prev.studentPool];
      studentPool[studentIdx] = { ...studentPool[studentIdx], isSelected: false };

      return {
        ...prev,
        studentPool,
        activeStudents: prev.activeStudents.filter((s) => s !== rollNumber),
        selectedStudent: prev.selectedStudent.filter((s) => s !== rollNumber),
        error: "",
      };
    });

    api.removeStudent(rollNumber).catch((e) => {
      set({ ...snapshot, error: e?.message ?? "Failed to remove student" });
    });
  },

  activateStudent: () => {
    const snapshot = get();

    set((prev) => {
      const batchSize = prev.selectedStudent.length;
      if (batchSize < 3) {
        return { ...prev, error: `Need at least 3 students (currently ${batchSize}).` };
      }
      if (batchSize > 4) {
        return { ...prev, error: "Cannot exceed 4 students in a batch." };
      }
      return {
        ...prev,
        activeStudents: [...prev.activeStudents, ...prev.selectedStudent],
        selectedStudent: [],
        error: "",
      };
    });

    api.activate().catch((e) => {
      set({ ...snapshot, error: e?.message ?? "Failed to activate batch" });
    });
  },

  setMarks: (rollNumber, field, value) => {
  
    set((prev) => {
      const studentIdx = prev.studentPool.findIndex(
        (curr) => curr.rollNumber === rollNumber
      );
      if (studentIdx === -1) return prev;

      const studentPool = [...prev.studentPool];
      const student = { ...studentPool[studentIdx] };
      student.marks = { ...student.marks, [field]: value };
      studentPool[studentIdx] = student;

      return { ...prev, studentPool, error: "" };
    });

    api
      .setMarks(rollNumber, field as MarkField, value)
      .catch((e) => set((prev) => ({ ...prev, error: e?.message ?? "Failed to save marks" })));
  },

  markStudentAsEvaluated: (rollNumber) => {
    const snapshot = get();

    if (!snapshot.activeStudents.includes(rollNumber)) return;
    set((prev) => ({
      ...prev,
      activeStudents: prev.activeStudents.filter((r) => r !== rollNumber),
      assignedStudents: [...prev.assignedStudents, rollNumber],
      error: "",
    }));

    api.evaluated(rollNumber).catch((e) => {
      set({ ...snapshot, error: e?.message ?? "Failed to mark evaluated" });
    });
  },

  setFinalizedStudent: () => {
    const snapshot = get();

    set((prev) => ({
      ...prev,
      finalizedStudents: [...prev.finalizedStudents, ...prev.assignedStudents],
      assignedStudents: [],
      error: "",
    }));

    api.finalize().catch((e) => {
      set({ ...snapshot, error: e?.message ?? "Failed to finalize" });
    });
  },
}));
