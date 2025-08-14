// src/store/useTaskStore.ts
import { create } from "zustand";
import type { Task } from "../types/Task";
import { axiosInstance } from "../lib/axios.js";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  loadTasks: () => Promise<void>;
  addTask: (title: string, description: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskDetails: (id: string, title: string, description: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  loadTasks: async () => {
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
      const res = await axiosInstance.post("/tasks", { title, description });
      const task = res.data;
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
}));
