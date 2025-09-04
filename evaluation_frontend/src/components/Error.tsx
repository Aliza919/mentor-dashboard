import mentorManagementStore from "../util/mentorManagementStore";

export default () => {
  const error = mentorManagementStore((state) => state.error);
  const clearError = mentorManagementStore((state) => state.clearError);
  return (
    <>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md border border-red-300 flex justify-between items-center">
          <span>{error}</span>

          <span
            className="cursor-pointer"
            onClick={() => {
              clearError();
            }}
          >
            x
          </span>
        </div>
      )}
    </>
  );
};
