import { useState } from "react";
import mentorManagementStore from "../util/mentorManagementStore";
import type students from "../types/student";

export default ({
  label,
  rollNumber,
  field,
}: {
  label: string;
  rollNumber: string;
  field: keyof students["marks"];
}) => {
  const [error, setError] = useState(false);
  const students = mentorManagementStore((state) => state.studentPool);

  const index = students.findIndex((curr) => curr.rollNumber == rollNumber);
  const setMarks = mentorManagementStore((state) => state.setMarks);
  return (
    <label className="flex flex-col text-sm">
      <div className="flex justify-between text-center">
        <span className="font-medium text-gray-600">{label}</span>
        {error && <span className="text-red-700 text-xs">Invalid</span>}
      </div>

      <input
        type="text"
        onKeyDown={(e) => {
          // Allow only digits and backspace
          if (
            !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(
              e.key
            ) &&
            !/^[0-9]$/.test(e.key)
          ) {
            e.preventDefault();
          }
        }}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "") {
            setMarks(rollNumber, field, null);
            setError(false);
            return;
          }

          const num = parseInt(val, 10);

          if (isNaN(num) || num < 1 || num > 10) {
            setError(true);
          } else {
            setMarks(rollNumber, field, num);
            setError(false);
          }
        }}
        className={`mt-1 p-2 border rounded-md outline-none ${
          error
            ? "border-red-500 text-red-700 focus:ring-1 focus:ring-red-500"
            : "focus:ring-1 focus:ring-blue-500"
        }`}
        value={
          students[index].marks[field] == null
            ? ""
            : String(students[index].marks[field])
        }
        placeholder="1–10"
      />
    </label>
  );
};
