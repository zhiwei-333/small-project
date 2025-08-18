// src/pages/TodoPage.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TodoLayout from "../components/TodoLayout";
import type { Task } from "../types/Task";
import AuthButton from "../components/auth/AuthButton";
import { useTaskStore } from "../store/useTaskStore";
import { useAuthStore } from "../store/useAuthStore";

export default function TodoPage() {
  const navigate = useNavigate();

  // Zustand store
  const {
    tasks,
    isLoading,
    error,
    loadTasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTaskDetails,
    reorderTasks,
  } = useTaskStore();

  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const { authUser,logout } = useAuthStore();

useEffect(() => {
  console.log("Fetching tasks for user:", authUser?._id);
  if (authUser) {
    loadTasks();
  }
}, [authUser, loadTasks]);

  // const getToken = () => localStorage.getItem("token") || "";

  // Load tasks on mount
  // useEffect(() => {
  //   const token = getToken();
  //   if (!token) {
  //     return;
  //   }
  //   loadTasks();
  // }, [loadTasks]);

  // Add task handler
  const handleAddTask = useCallback(async () => {
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle, newTaskDescription);
    setNewTaskTitle("");
    setNewTaskDescription("");
  }, [newTaskTitle, newTaskDescription, addTask]);

  // handle logout
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter") handleAddTask();
  };

  const handleToggleTask = async (id: string) => {
    await toggleTask(id);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    if (selectedTask && selectedTask._id === id) closeModal();
  };

  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedTask || !editTitle.trim()) return;
    await updateTaskDetails(selectedTask._id, editTitle, editDescription);
    setIsEditing(false);
    closeModal();
  };

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  // const handleDrop = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
  //   e.preventDefault();
  //   if (!draggedTask) return;
  //   const updatedTasks = [...tasks];
  //   const fromIndex = updatedTasks.findIndex((t) => t._id === draggedTask);
  //   const toIndex = updatedTasks.findIndex((t) => t._id === taskId);
  //   if (fromIndex === -1 || toIndex === -1) return;
  //   const [moved] = updatedTasks.splice(fromIndex, 1);
  //   updatedTasks.splice(toIndex, 0, moved);
  //   // Local reordering only
  //   // You may call an API if backend ordering is needed
  //   setDraggedTask(null);
  // };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.preventDefault();
    if (!draggedTask) return;

    const fromIndex = tasks.findIndex((t) => t._id === draggedTask);
    const toIndex = tasks.findIndex((t) => t._id === taskId);
    if (fromIndex === -1 || toIndex === -1) return;

    reorderTasks(fromIndex, toIndex);
    setDraggedTask(null);
  };

  const getTabCount = (tab: "all" | "pending" | "completed") => {
    if (tab === "all") return tasks.length;
    if (tab === "pending") return tasks.filter((t) => !t.completed).length;
    if (tab === "completed") return tasks.filter((t) => t.completed).length;
    return 0;
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === "pending") return !t.completed;
    if (activeTab === "completed") return t.completed;
    return true;
  });

  return (
    <>
      <TodoLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        newTaskTitle={newTaskTitle}
        setNewTaskTitle={setNewTaskTitle}
        newTaskDescription={newTaskDescription}
        setNewTaskDescription={setNewTaskDescription}
        addTask={handleAddTask}
        handleKeyPress={handleKeyPress}
        filteredTasks={filteredTasks}
        draggedTask={draggedTask}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        toggleTask={handleToggleTask}
        openTaskModal={openTaskModal}
        deleteTaskHandler={handleDeleteTask}
        getTabCount={getTabCount}
        isModalOpen={isModalOpen}
        selectedTask={selectedTask}
        closeModal={closeModal}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editDescription={editDescription}
        setEditDescription={setEditDescription}
        saveEdit={handleSaveEdit}
        isLoading={isLoading}
        error={error}
      />
      <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
        {!authUser && (<>
        <AuthButton text="Login" onClick={() => navigate("/login")} />
        <AuthButton text="Signup" onClick={() => navigate("/signup")} />
          </>)}
        
        {authUser&&(<AuthButton text="Logout" onClick={() => handleLogout()} />)}
      </div>
    </>
  );
}
