
import jsPDF from "jspdf";       
import autoTable from "jspdf-autotable"; 
import type Student from "../types/student";

function totalMarks(s: Student) {
  return (s.marks.ideation ?? 0) + (s.marks.execution ?? 0) + (s.marks.viva_pitch ?? 0);
}

export function exportFinalizedStudentsMultiPerPage(
  students: Student[],
  options?: { filename?: string; perPage?: number; cols?: number; openInNewTab?: boolean }
) {
  const filename = options?.filename ?? "finalized_students_multi.pdf";
  const perPage = options?.perPage ?? 4;
  const cols = options?.cols ?? 2;
  const openInNewTab = options?.openInNewTab ?? false;

  if (!students || students.length === 0) {
    console.warn("No students provided to exportFinalizedStudentsMultiPerPage");
    return;
  }

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const margin = 40;
  const headerHeight = 60;
  const contentW = pageW - margin * 2;
  const colWidth = contentW / cols;
  const rowsPerPage = Math.ceil(perPage / cols);
  const contentH = pageH - margin * 2 - headerHeight;
  const rowHeight = contentH / rowsPerPage;

  const totalPages = Math.ceil(students.length / perPage);

  let studentIndex = 0;
  for (let p = 0; p < totalPages; p++) {
    if (p > 0) doc.addPage();

    doc.setFontSize(16);
    doc.text("Finalized Students — Marks Report", margin, margin + 18);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, margin + 36);
    doc.setLineWidth(0.5);
    doc.line(margin, margin + 44, pageW - margin, margin + 44);

    for (let slot = 0; slot < perPage && studentIndex < students.length; slot++, studentIndex++) {
      const student = students[studentIndex];
      const localRow = Math.floor(slot / cols);
      const localCol = slot % cols;

      const startX = margin + localCol * colWidth;
      const startY = margin + headerHeight + localRow * rowHeight;

      doc.setFontSize(11);
      doc.text(`Roll: ${student.rollNumber}`, startX + 6, startY + 14);
      doc.setFontSize(9);
      doc.text(`${student.email}`, startX + 6, startY + 30);

      const tableHead = [["Component", "Marks"]];
      const tableBody = [
        ["Ideation", student.marks.ideation ?? "-"],
        ["Execution", student.marks.execution ?? "-"],
        ["Viva / Pitch", student.marks.viva_pitch ?? "-"],
        ["", ""],
        ["Total", String(totalMarks(student))],
      ];

      const tableWidth = colWidth - 12;
      const rightMargin = pageW - (startX + tableWidth - 6);

    
      autoTable(doc, {
        startY: startY + 36,
        head: tableHead,
        body: tableBody,
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [60, 60, 60] },
        margin: { left: startX + 6, right: rightMargin },
        tableWidth: tableWidth,
        willDrawCell: () => {}, 
      });

      
      const boxX = startX;
      const boxY = startY - 6;
      const boxW = colWidth;
      const boxH = rowHeight - 6;
      doc.setDrawColor(200);
      doc.setLineWidth(0.4);
      doc.rect(boxX + 2, boxY + 2, boxW - 4, boxH - 4);
      doc.setDrawColor(0);
    }
  }

  if (openInNewTab) {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } else {
    doc.save(filename);
  }
}
