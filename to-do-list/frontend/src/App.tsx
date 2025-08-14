// import './App.css'
// import ToDo from './components/ToDo'
// import TodoLayout from './components/TodoLayout'

// function App() {

//   return (
//     <>
//       <ToDo/>

//     </>
//   )
// }

// export default App

import { useState, useCallback } from "react";
import "./App.css";
import TodoLayout from "./components/TodoLayout";
import type { Task } from "./types/Task";
import {
  fetchTasks,
  createTask,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
} from "./api/task";
import { useEffect } from "react";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">(
    "all"
  );
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Retrieve token once
  const getToken = () => localStorage.getItem("token") || "";

  useEffect(() => {
    const loadTasks = async () => {
      const token = getToken();
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const apiTasks = await fetchTasks(token);
        const tasks = apiTasks.map((task: any) => ({
          ...task,
          createdAt:
            typeof task.createdAt === "string"
              ? task.createdAt
              : new Date(task.createdAt).toISOString(),
        }));
        setTasks(tasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, []);

  // const addTask = async () => {
  //     if (!newTaskTitle.trim()) return;

  //     setIsLoading(true);
  //     setError(null);
  //     try {
  //       const task = await createTask({
  //         title: newTaskTitle,
  //         description: newTaskDescription,
  //       });
  //       const normalizedTask = {
  //         ...task,
  //         createdAt:
  //           typeof task.createdAt === "string"
  //             ? task.createdAt
  //             : new Date(task.createdAt).toISOString(),
  //       };
  //       setTasks([...tasks, normalizedTask]);
  //       setNewTaskTitle("");
  //       setNewTaskDescription("");
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : "Failed to create task");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const addTask = useCallback(async () => {
    if (!newTaskTitle.trim()) return;
    const token = getToken();
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const task = await createTask(
        { title: newTaskTitle, description: newTaskDescription },
        token
      );
      const normalizedTask = {
        ...task,
        createdAt:
          typeof task.createdAt === "string"
            ? task.createdAt
            : new Date(task.createdAt).toISOString(),
      };
      setTasks((prev) => [...prev, normalizedTask]);
      setNewTaskTitle("");
      setNewTaskDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  }, [newTaskTitle, newTaskDescription]);

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const toggleTask = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedTask = await toggleTaskCompletion(id);
      const normalizedUpdatedTask = {
        ...updatedTask,
        createdAt:
          typeof updatedTask.createdAt === "string"
            ? updatedTask.createdAt
            : new Date(updatedTask.createdAt).toISOString(),
      };
      setTasks(
        tasks.map((task) => (task._id === id ? normalizedUpdatedTask : task))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTaskHandler = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteTask(id);
      setTasks((tasks) => tasks.filter((task) => task._id !== id));
      if (selectedTask && selectedTask._id === id) {
        closeModal();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    } finally {
      setIsLoading(false);
    }
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

  const saveEdit = async () => {
    if (!selectedTask || !editTitle.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const updatedTask = await updateTask(selectedTask._id, {
        title: editTitle,
        description: editDescription,
      });
      const normalizedUpdatedTask = {
        ...updatedTask,
        createdAt:
          typeof updatedTask.createdAt === "string"
            ? updatedTask.createdAt
            : new Date(updatedTask.createdAt).toISOString(),
      };
      setTasks(
        tasks.map((task) =>
          task._id === selectedTask._id ? normalizedUpdatedTask : task
        )
      );
      setSelectedTask(normalizedUpdatedTask);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string
  ) => {
    e.dataTransfer.effectAllowed = "move";
    // const task = tasks.find((t) => t._id === taskId) || null;
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {

    e.preventDefault();
    if (!draggedTask) return;
    const updatedTasks = [...tasks];
    const fromIndex = updatedTasks.findIndex((t) => t._id === draggedTask);
    const toIndex = updatedTasks.findIndex((t) => t._id === taskId);
    if (fromIndex === -1 || toIndex === -1) return;
    const [moved] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, moved);
    setTasks(updatedTasks);
    setDraggedTask(null);
  },[]);

  const getTabCount = (tab: "all" | "pending" | "completed") => {
    if (tab === "all") return tasks.length;
    if (tab === "pending") return tasks.filter((t) => !t.completed).length;
    if (tab === "completed") return tasks.filter((t) => t.completed).length;
    return 0;
  };

  // Filtered tasks for the current tab
  const filteredTasks = tasks.filter((t) => {
    if (activeTab === "pending") return !t.completed;
    if (activeTab === "completed") return t.completed;
    return true;
  });

  return (
    <TodoLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      newTaskTitle={newTaskTitle}
      setNewTaskTitle={setNewTaskTitle}
      newTaskDescription={newTaskDescription}
      setNewTaskDescription={setNewTaskDescription}
      addTask={addTask}
      handleKeyPress={handleKeyPress}
      filteredTasks={filteredTasks}
      draggedTask={draggedTask}
      handleDragStart={handleDragStart}
      handleDragOver={handleDragOver}
      handleDrop={handleDrop}
      toggleTask={toggleTask}
      openTaskModal={openTaskModal}
      deleteTaskHandler={deleteTaskHandler}
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
      saveEdit={saveEdit}
      isLoading={isLoading}
      error={error}
    />
  );
}
