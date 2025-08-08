import { Calendar } from "lucide-react";

export default function TodoHeader() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Calendar className="w-6 h-6 text-gray-700" />
      <h1 className="text-2xl font-bold text-gray-800">To-Do List</h1>
    </div>
  );
}
