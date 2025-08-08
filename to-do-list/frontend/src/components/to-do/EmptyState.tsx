import { Calendar } from "lucide-react";
import type { EmptyStateProps } from "../../types/props";

export default function EmptyState({ activeTab }:EmptyStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500">
      <Calendar className="w-12 h-12 mb-3 opacity-50" />
      <p className="text-center">
        {activeTab === "pending"
          ? "No pending tasks!"
          : activeTab === "completed"
          ? "No completed tasks yet."
          : "No tasks yet. Add one above!"}
      </p>
    </div>
  );
}
