import { memo } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import type { TaskItemProps } from "../../types/props";

function TaskItem({
  task,
  draggedTask,
  handleDragStart,
  handleDragOver,
  handleDrop,
  toggleTask,
  openTaskModal,
  deleteTaskHandler
}: TaskItemProps) {
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task._id)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, task._id)}
      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-move hover:bg-gray-50 ${
        draggedTask === task._id ? "opacity-50" : ""
      }`}
    >
      <GripVertical className="w-4 h-4 text-gray-400" />
      <button
        onClick={() => toggleTask(task._id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          task.completed
            ? "bg-orange-500 border-orange-500"
            : "border-gray-300 hover:border-orange-500"
        }`}
      >
        {task.completed && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>
      <button
        onClick={() => openTaskModal(task)}
        className={`flex-1 text-left transition-all duration-200 hover:text-orange-600 ${
          task.completed ? "text-gray-500 line-through" : "text-gray-800"
        }`}
      >
        {task.title}
        {task.description && (
          <div className="text-xs text-gray-400 mt-1 truncate">
            {task.description}
          </div>
        )}
      </button>
      <button
        onClick={() => deleteTaskHandler(task._id)}
        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// Custom props comparison — re-render only if these change
export default memo(TaskItem, (prevProps, nextProps) => {
  return (
    prevProps.task._id === nextProps.task._id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.description === nextProps.task.description &&
    prevProps.task.completed === nextProps.task.completed &&
    prevProps.draggedTask === nextProps.draggedTask
  );
});
