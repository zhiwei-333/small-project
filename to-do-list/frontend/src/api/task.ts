const API_BASE_URL = "/api/tasks";

export interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const fetchTasks = async (): Promise<Task[]> => {
  console.log("[fetchTasks] Fetching tasks from API...");
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
};

export const createTask = async (task: {
  title: string;
  description?: string;
}): Promise<Task> => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: task.title,
      description: task.description || "",
      completed: false,
    }),
  });
 
  // This logs the actual data
  const  data = await response.json();
  console.log(data); // now logs the created task object
  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return data;
};

export const updateTask = async (
  id: string,
  updates: { title?: string; description?: string; completed?: boolean }
): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error("Failed to update task");
  }
  return response.json();
};

// export const toggleTaskCompletion = async (id: string): Promise<Task> => {
//   const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
//     method: "PATCH",
//   });
//   console.log(response.json);
//   if (!response.ok) {
//     throw new Error("Failed to toggle task");
//   }
//   return response.json();
// };

export const toggleTaskCompletion = async (id: string): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
    method: "PATCH",
  });
  if (!response.ok) {
    throw new Error("Failed to toggle task");
  }
  
  const data = await response.json();
  console.log(data); // logs the updated task object
  return data;
  
};

export const deleteTask = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  console.log(response.json);
  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
};
