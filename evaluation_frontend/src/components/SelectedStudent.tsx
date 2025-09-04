import { Lock, Trash2 } from "lucide-react";
import mentorManagementStore from "../util/mentorManagementStore";

export default () => {
  const selectedStudent = mentorManagementStore(
    (state) => state.selectedStudent
  );
  // const activeStudents = mentorManagementStore((state) => state.activeStudents);
  const removeStudent = mentorManagementStore((state) => state.removeStudent);
  const activateStudent = mentorManagementStore(
    (state) => state.activateStudent
  );

  const isLocked = selectedStudent.length > 0;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Selected Students
        </h2>

        <button
          onClick={activateStudent}
          // disabled={selectedStudent.length < 3 || isLocked}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
            !isLocked
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          <Lock className="w-4 h-4" />
          Activate
        </button>
      </div>

      {/* Empty State */}
      {selectedStudent.length === 0 ? (
        <p className="text-gray-400 italic">No students selected yet.</p>
      ) : (
        <div className="flex gap-4">
          {selectedStudent.map((rollNumber, idx) => (
            <div
              key={rollNumber}
              className={`rounded-lg border px-4 py-2 transition-all bg-green-200 text-green-700 hover:bg-red-200 hover:text-red-600 cursor-pointer`}
              onClick={() => {
                removeStudent(rollNumber, idx);
              }}
            >
              <span className="text-sm font-medium">{rollNumber}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
