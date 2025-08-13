// const API_BASE_URL = "/api/tasks";

// export interface Task {
//   _id: string;
//   title: string;
//   description: string;
//   completed: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export const fetchTasks = async (): Promise<Task[]> => {
//   const response = await fetch(API_BASE_URL);
//   if (!response.ok) {
//     throw new Error("Failed to fetch tasks");
//   }
//   return response.json();
// };

// export const createTask = async (task: {
//   title: string;
//   description?: string;
// }): Promise<Task> => {
//   const response = await fetch(API_BASE_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       title: task.title,
//       description: task.description || "",
//       completed: false,
//     }),
//   });
//   if (!response.ok) {
//     throw new Error("Failed to create task");
//   }
//   return response.json();
// };

// export const updateTask = async (
//   id: string,
//   updates: { title?: string; description?: string; completed?: boolean }
// ): Promise<Task> => {
//   const response = await fetch(`${API_BASE_URL}/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(updates),
//   });
//   if (!response.ok) {
//     throw new Error("Failed to update task");
//   }
//   return response.json();
// };

// export const toggleTaskCompletion = async (id: string): Promise<Task> => {
//   const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
//     method: "PATCH",
//   });
//   if (!response.ok) {
//     throw new Error("Failed to toggle task");
//   }
//   return response.json();
// };

// export const deleteTask = async (id: string): Promise<void> => {
//   const response = await fetch(`${API_BASE_URL}/${id}`, {
//     method: "DELETE",
//   });
//   if (!response.ok) {
//     throw new Error("Failed to delete task");
//   }
// };
const API_BASE_URL = "/api/tasks";

export interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  user: string; // Add user field
}

// Helper function to get authorization headers
const getAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const fetchTasks = async (token: string): Promise<Task[]> => {
  const response = await fetch(API_BASE_URL, {
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
};

export const createTask = async (
  task: {
    title: string;
    description?: string;
  },
  token: string
): Promise<Task> => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({
      title: task.title,
      description: task.description || "",
      completed: false,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to create task");
  }
  return response.json();
};

export const updateTask = async (
  id: string,
  updates: { title?: string; description?: string; completed?: boolean },
  token: string
): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error("Failed to update task");
  }
  return response.json();
};

export const toggleTaskCompletion = async (
  id: string,
  token: string
): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to toggle task");
  }
  return response.json();
};

export const deleteTask = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
};
