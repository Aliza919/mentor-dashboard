const API_BASE =
  (import.meta as any).env?.VITE_API_BASE ?? "http://localhost:4000";

export type MarkField = "ideation" | "execution" | "viva_pitch";

export const api = {
  getStudentPool: async () => {
    const r = await fetch(`${API_BASE}/api/students`);
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  getState: async () => {
    const r = await fetch(`${API_BASE}/api/students/state`);
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  addStudent: async (roll: string) => {
    const r = await fetch(`${API_BASE}/api/students/${roll}/add`, {
      method: "POST",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  removeStudent: async (roll: string) => {
    const r = await fetch(`${API_BASE}/api/students/${roll}/remove`, {
      method: "DELETE",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  activate: async () => {
    const r = await fetch(`${API_BASE}/api/students/activate`, {
      method: "POST",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  setMarks: async (roll: string, field: MarkField, value: number | null) => {
    const r = await fetch(`${API_BASE}/api/students/${roll}/marks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, value }),
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  evaluated: async (roll: string) => {
    const r = await fetch(`${API_BASE}/api/students/${roll}/evaluated`, {
      method: "POST",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  finalize: async () => {
    const r = await fetch(`${API_BASE}/api/students/finalize`, {
      method: "POST",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
};
