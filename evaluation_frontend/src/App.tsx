import "./App.css";
import ActiveStudent from "./components/ActiveStudent";
import Error from "./components/Error";
import FinalizedStudent from "./components/finalizedStudent";
import SelecteStudent from "./components/SelectedStudent";
import StudentPool from "./components/StudentPool";
import { useEffect } from "react";
import useMentor from "./util/mentorManagementStore";

export default function App() {
  const hydrate = useMentor((s) => s.hydrate);
  const error = useMentor((s) => s.error);
  const clearError = useMentor((s) => s.clearError);

  useEffect(() => {
    hydrate();
    console.log("App mounted, calling hydrate()");
  }, []);

  return (
    <article className="p-6 space-y-6">
      {error && (
        <div className="error-banner" onClick={clearError}>
          {String(error)}
        </div>
      )}
      <Error />
      <ActiveStudent />
      <SelecteStudent />
      <StudentPool />
      <FinalizedStudent />
    </article>
  );
}
