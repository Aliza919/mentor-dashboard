import { useState } from "react";
import mentorManagementStore from "../util/mentorManagementStore";
import MarksInput from "./MarksInput";
import type studentType from "../types/student";

export default () => {
  const activeStudents = mentorManagementStore((state) => state.activeStudents);
  const assignedStudents = mentorManagementStore(
    (state) => state.assignedStudents
  );
  const studentPool = mentorManagementStore((state) => state.studentPool);
  const removeStudent = mentorManagementStore((state) => state.removeStudent);
  const markStudentAsEvaluated = mentorManagementStore(
    (state) => state.markStudentAsEvaluated
  );
  const setFinalizedStudent = mentorManagementStore(
    (state) => state.setFinalizedStudent
  );

  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  // Filter logic
  let studentsToShow: string[] = [];
  if (filter === "all") {
    studentsToShow = [...activeStudents, ...assignedStudents];
  } else if (filter === "pending") {
    studentsToShow = activeStudents;
  } else if (filter === "completed") {
    studentsToShow = assignedStudents;
  }

  return (
    <section>
      {/* Header with Filters */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Students</h2>
        <div className="flex gap-2">
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-3 py-1 rounded-md text-sm capitalize ${
                filter === f ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        {/* ✅ Finalize Button - only if >= 3 assigned */}
        {assignedStudents.length >= 3 && (
          <button
            onClick={setFinalizedStudent}
            className="px-4 py-2 rounded-md text-sm bg-green-600 text-white hover:bg-green-700"
          >
            Finalize Assigned Students
          </button>
        )}
      </div>

      {/* Empty State */}
      {studentsToShow.length === 0 ? (
        <p className="text-gray-500">No students found for this filter.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {studentsToShow.map((rollNumber, idx) => {
            const student = studentPool.find(
              (s) => s.rollNumber === rollNumber
            ) as studentType | undefined;
            if (!student) return null;

            const marks = student.marks;

            // All fields must be valid numbers between 1–10
            const allValid = Object.values(marks).every(
              (m) => typeof m === "number" && m > 0 && m <= 10
            );

            const total =
              (marks.ideation || 0) +
              (marks.execution || 0) +
              (marks.viva_pitch || 0);

            const isCompleted = assignedStudents.includes(rollNumber);

            return (
              <div
                key={rollNumber}
                className="bg-white shadow rounded-xl border border-gray-200 p-5 hover:shadow-lg transition"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    {rollNumber}
                  </h3>
                  {/* ✅ Remove only if not completed */}
                  {!isCompleted && (
                    <button
                      className="text-red-500 hover:bg-red-100 px-3 py-1 rounded-md text-sm"
                      onClick={() => removeStudent(rollNumber, idx)}
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>

                {/* Marks Grid - always editable */}
                <div className="space-y-3">
                  <MarksInput
                    label="Ideation"
                    rollNumber={rollNumber}
                    field="ideation"
                  />
                  <MarksInput
                    label="Execution"
                    rollNumber={rollNumber}
                    field="execution"
                  />
                  <MarksInput
                    label="Viva/Pitch"
                    rollNumber={rollNumber}
                    field="viva_pitch"
                  />
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Total: {total}/30
                  </span>

                  {/* Pending → can mark as completed */}
                  {!isCompleted && allValid && (
                    <button
                      className="px-3 py-1 rounded-md text-xs bg-black text-white hover:bg-gray-800"
                      onClick={() => markStudentAsEvaluated(rollNumber)}
                    >
                      Mark Completed
                    </button>
                  )}

                  {/* Completed → still editable, but no remove */}
                  {isCompleted && (
                    <span className="text-xs text-yellow-600 font-medium">
                      ✅ Assigned (waiting finalization)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
