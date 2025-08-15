import { Calendar } from "lucide-react";
import type { EmptyStateProps } from "../../types/props";
import { useAuthStore } from "../../store/useAuthStore";
export default function EmptyState({ activeTab }:EmptyStateProps) {
  const { authUser } = useAuthStore();
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500">
      <Calendar className="w-12 h-12 mb-3 opacity-50" />
      {authUser ? ( <p className="text-center">
        {activeTab === "pending"
          ? "No pending tasks!"
          : activeTab === "completed"
          ? "No completed tasks yet."
          : "No tasks yet. Add one above!"}
      </p>) : (<p className="text-center">"Please login / signup to see your tasks."</p>)}
     
    </div>
  );
}
