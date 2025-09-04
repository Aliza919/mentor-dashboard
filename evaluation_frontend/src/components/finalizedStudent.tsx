import React, { useMemo, useState } from "react";
import useMentor from "../util/mentorManagementStore";
import type Student from "../types/student";
import { exportFinalizedStudentsMultiPerPage } from "../util/export";

export default function FinalizedStudent() {
  const studentPool = useMentor((s) => s.studentPool);
  const finalized = useMentor((s) => s.finalizedStudents);

  console.log(finalized)
  const [perPage, setPerPage] = useState<number>(4); 
  const [cols, setCols] = useState<number>(2); 
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const finalizedStudents: Student[] = useMemo(() => {
    const map = new Map(studentPool.map((st) => [st.rollNumber, st]));
    return finalized.map((rn) => map.get(rn)).filter(Boolean) as Student[];
  }, [studentPool, finalized]);

  const handlePreview = () => {
    if (finalizedStudents.length === 0) return;
    setIsGenerating(true);
    try {
      exportFinalizedStudentsMultiPerPage(finalizedStudents, {
        perPage,
        cols,
        openInNewTab: true,
        filename: `finalized_students_${perPage}pp_${cols}cols.pdf`,
      });
    } finally {
    
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (finalizedStudents.length === 0) return;
    setIsGenerating(true);
    try {
      exportFinalizedStudentsMultiPerPage(finalizedStudents, {
        perPage,
        cols,
        openInNewTab: false,
        filename: `finalized_students_${perPage}pp_${cols}cols.pdf`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Finalized Students ({finalizedStudents.length})</h2>

        <div className="flex items-center gap-2">
          <label className="text-sm">Per page:</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            disabled={isGenerating}
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={6}>6</option>
            <option value={8}>8</option>
          </select>

          <label className="text-sm">Columns:</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            disabled={isGenerating}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>

          <button
            className="px-3 py-1 rounded bg-slate-800 text-white text-sm"
            onClick={handlePreview}
            disabled={isGenerating || finalizedStudents.length === 0}
            title="Preview PDF (opens in new tab)"
          >
            {isGenerating ? "Generating..." : "View PDF"}
          </button>

          <button
            className="px-3 py-1 rounded border text-sm"
            onClick={handleDownload}
            disabled={isGenerating || finalizedStudents.length === 0}
            title="Download PDF containing all finalized students"
          >
            {isGenerating ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      {finalizedStudents.length === 0 ? (
        <div className="text-sm text-gray-500">No finalized students yet.</div>
      ) : (
        <div className="space-y-2">
          {finalizedStudents.map((s) => {
            const total = (s.marks.ideation ?? 0) + (s.marks.execution ?? 0) + (s.marks.viva_pitch ?? 0);
            return (
              <div
                key={s.rollNumber}
                className="p-3 rounded border flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{s.rollNumber}</div>
                  <div className="text-sm text-gray-600">{s.email}</div>
                  <div className="text-sm mt-1">
                    Ideation: {s.marks.ideation ?? "-"} · Execution: {s.marks.execution ?? "-"} · Viva: {s.marks.viva_pitch ?? "-"} · Total: {total}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
