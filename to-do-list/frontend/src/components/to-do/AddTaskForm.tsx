import type { AddTaskFormProps } from "../../types/props";

export default function AddTaskForm({
  newTaskTitle,
  setNewTaskTitle,
  newTaskDescription,
  setNewTaskDescription,
  addTask,
  handleKeyPress
}:AddTaskFormProps) {
  return (
    <div className="space-y-3 mb-6">
      <input
        type="text"
        placeholder="Task title"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full block bg-gray-100 border-0 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:bg-white"
      />
      <textarea
        placeholder="Task description (optional)"
        value={newTaskDescription}
        onChange={(e) => setNewTaskDescription(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full block bg-gray-100 border-0 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:bg-white resize-none"
        rows={2}
      />
      <button
        onClick={addTask}
        disabled={!newTaskTitle.trim()}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ADD TASK +
      </button>
    </div>
  );
}
