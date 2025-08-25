// src/types/props.ts
import type {Task } from "./Task";

export type TabType = "all" | "pending" | "completed";

export interface TodoLayoutProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  newTaskTitle: string;
  setNewTaskTitle: (title: string) => void;
  newTaskDescription: string;
  setNewTaskDescription: (desc: string) => void;
  addTask: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  filteredTasks: Task[];
  draggedTask: string | null;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  toggleTask: (id: string) => void;
  openTaskModal: (task: Task) => void;
  deleteTaskHandler: (id: string) => void;
  getTabCount: (tab: TabType) => number;
  isModalOpen: boolean;
  selectedTask: Task | null;
  closeModal: () => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  editTitle: string;
  setEditTitle: (value: string) => void;
  editDescription: string;
  setEditDescription: (value: string) => void;
  saveEdit: () => void;
  isLoading?: boolean;
  error?: string | null;
}


export interface TabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  getTabCount: (tab: TabType) => number;
}

export interface AddTaskFormProps {
  newTaskTitle: string;
  setNewTaskTitle: (title: string) => void;
  newTaskDescription: string;
  setNewTaskDescription: (desc: string) => void;
  addTask: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface TaskListProps {
  filteredTasks: Task[];
  draggedTask: string | null;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  toggleTask: (id: string) => void;
  openTaskModal: (task: Task) => void;
  deleteTaskHandler: (id: string) => void;
  activeTab: TabType;
}

export interface TaskItemProps {
  task: Task;
  draggedTask: string | null;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  toggleTask: (id: string) => void;
  openTaskModal: (task: Task) => void;
  deleteTaskHandler: (id: string) => void;
}

export interface EmptyStateProps {
  activeTab: TabType;
}

export interface TaskModalProps {
  selectedTask: Task;
  closeModal: () => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  editTitle: string;
  setEditTitle: (value: string) => void;
  editDescription: string;
  setEditDescription: (value: string) => void;
  saveEdit: () => void;
  toggleTask: (id: string) => void;
  deleteTaskHandler: (id: string) => void;
}

