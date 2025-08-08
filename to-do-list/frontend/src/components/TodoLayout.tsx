import TodoHeader from "./to-do/TodoHeader";
import Tabs from "./to-do/Tabs";
import AddTaskForm from "./to-do/AddTaskForm";
import TaskList from "./to-do/TaskList";
import TaskModal from "./to-do/TaskModal";
import type { TodoLayoutProps } from "../types/props";

export default function TodoLayout({
  activeTab,
  setActiveTab,
  newTaskTitle,
  setNewTaskTitle,
  newTaskDescription,
  setNewTaskDescription,
  addTask,
  handleKeyPress,
  filteredTasks,
  draggedTask,
  handleDragStart,
  handleDragOver,
  handleDrop,
  toggleTask,
  openTaskModal,
  deleteTaskHandler,
  getTabCount,
  isModalOpen,
  selectedTask,
  closeModal,
  isEditing,
  setIsEditing,
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  saveEdit
}:TodoLayoutProps){
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl p-6 h-[85vh] flex flex-col">
        
        <TodoHeader />

        <Tabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          getTabCount={getTabCount}
        />

        <AddTaskForm
          newTaskTitle={newTaskTitle}
          setNewTaskTitle={setNewTaskTitle}
          newTaskDescription={newTaskDescription}
          setNewTaskDescription={setNewTaskDescription}
          addTask={addTask}
          handleKeyPress={handleKeyPress}
        />

        <TaskList
          filteredTasks={filteredTasks}
          draggedTask={draggedTask}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          toggleTask={toggleTask}
          openTaskModal={openTaskModal}
          deleteTaskHandler={deleteTaskHandler}
          activeTab={activeTab}
        />
      </div>

      {isModalOpen && selectedTask && (
        <TaskModal
          selectedTask={selectedTask}
          closeModal={closeModal}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          editDescription={editDescription}
          setEditDescription={setEditDescription}
          saveEdit={saveEdit}
          toggleTask={toggleTask}
          deleteTaskHandler={deleteTaskHandler}
        />
      )}
    </div>
  );
}
