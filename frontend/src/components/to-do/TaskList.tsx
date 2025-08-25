import TaskItem from "./TaskItem";
import EmptyState from "./EmptyState";
import type { TaskListProps } from "../../types/props";

export default function TaskList({
  filteredTasks,
  draggedTask,
  handleDragStart,
  handleDragOver,
  handleDrop,
  toggleTask,
  openTaskModal,
  deleteTaskHandler,
  activeTab
}:TaskListProps) {
  return (
    <div className="space-y-3 h-full overflow-y-auto">
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            draggedTask={draggedTask}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            toggleTask={toggleTask}
            openTaskModal={openTaskModal}
            deleteTaskHandler={deleteTaskHandler}
          />
        ))
      ) : (
        <EmptyState activeTab={activeTab} />
      )}
    </div>
  );
}
