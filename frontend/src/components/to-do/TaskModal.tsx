// src/components/to-do/TaskModal.tsx
import { Edit3, X } from "lucide-react";
import type { TaskModalProps } from "../../types/props";

export default function TaskModal({
  selectedTask,
  closeModal,
  isEditing,
  setIsEditing,
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  saveEdit,
  toggleTask,
  deleteTaskHandler
}: TaskModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Task Details</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-500 hover:text-orange-500 transition-colors duration-200"
            >
              <Edit3 className="w-5 h-5" />
            </button>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full p-2 border rounded-lg resize-none"
                rows={4}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={saveEdit}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3
                className={`text-lg font-semibold ${
                  selectedTask.completed
                    ? "text-gray-300 line-through"
                    : "text-gray-800"
                }`}
              >
                {selectedTask.title}
              </h3>
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                  selectedTask.completed
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {selectedTask.completed ? "Completed" : "Pending"}
              </div>
            </div>

            {selectedTask.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Description
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {selectedTask.description}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  toggleTask(selectedTask._id);
                  closeModal();
                }}
                className={`flex-1 py-2 px-4 rounded-lg text-white ${
                  selectedTask.completed
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                Mark as {selectedTask.completed ? "Pending" : "Completed"}
              </button>
              <button
                onClick={() => deleteTaskHandler(selectedTask._id)}
                className="py-2 px-4 rounded-lg border border-red-600 text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
