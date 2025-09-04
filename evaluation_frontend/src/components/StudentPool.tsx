import mentorManagementStore from "../util/mentorManagementStore";
import type studentType from "../types/student";

export default () => {
  const addStudent = mentorManagementStore((state) => state.addStudent);
  const studentPool = mentorManagementStore((state) => state.studentPool);

  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">Student Pool</h2>
      <div className="flex flex-wrap gap-3 max-w-[800px] border rounded-lg p-4">
        {studentPool.map((curr: studentType) => {
          return (
            <button
              key={curr.rollNumber}
              className={`px-4 py-2 rounded-lg border text-sm font-medium shadow-sm transition-all ${
                curr.isSelected
                  ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-100 border-blue-400 text-blue-800 hover:bg-blue-200 hover:shadow cursor-pointer"
              }`}
              onClick={() => {
                if (!curr.isSelected) addStudent(curr.rollNumber);
              }}
              disabled={curr.isSelected}
            >
              {curr.rollNumber}
            </button>
          );
        })}
      </div>
    </section>
  );
};
