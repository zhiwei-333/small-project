// src/store/useTaskStore.ts
import { create } from "zustand";
import type { Task } from "../types/Task";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  loadTasks: () => Promise<void>;
  addTask: (title: string, description: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskDetails: (id: string, title: string, description: string) => Promise<void>;
  reorderTasks: (fromIndex: number, toIndex: number) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  loadTasks: async () => {
    console.log("Loading tasks...");
    const {authUser} = useAuthStore.getState();
    console.log("Current user id:", authUser?._id);
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/tasks");
      set({
        tasks: res.data.map((task: Task) => ({
          ...task,
          createdAt:
            typeof task.createdAt === "string"
              ? task.createdAt
              : task.createdAt
                ? new Date(task.createdAt).toISOString()
                : "",
        })),
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to load tasks" });
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (title, description) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Adding task:", { title, description,completed: false });
      const res = await axiosInstance.post("/tasks", { title, description });
      console.log("Task added response:", res.data);
      const task = res.data;
      console.log("Task state:", task);
      set((state) => ({
        tasks: [
          ...state.tasks,
          {
            ...task,
            createdAt:
              typeof task.createdAt === "string"
                ? task.createdAt
                : new Date(task.createdAt).toISOString(),
          },
        ],
      }));
      console.log("Task added successfully:", task);
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to create task" });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.patch(`/tasks/${id}/toggle`);
      const updatedTask = res.data;
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id
            ? {
                ...updatedTask,
                createdAt:
                  typeof updatedTask.createdAt === "string"
                    ? updatedTask.createdAt
                    : new Date(updatedTask.createdAt).toISOString(),
              }
            : task
        ),
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update task" });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete task" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTaskDetails: async (id, title, description) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.put(`/tasks/${id}`, { title, description });
      const updatedTask = res.data;
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id
            ? {
                ...updatedTask,
                createdAt:
                  typeof updatedTask.createdAt === "string"
                    ? updatedTask.createdAt
                    : new Date(updatedTask.createdAt).toISOString(),
              }
            : task
        ),
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update task" });
    } finally {
      set({ isLoading: false });
    }
  },

  reorderTasks: (fromIndex: number, toIndex: number) =>
  set((state) => {
    const updated = [...state.tasks];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    return { tasks: updated };
  }),
}));
