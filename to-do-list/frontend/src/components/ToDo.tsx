// import React from "react";
// import { useState, useEffect } from "react";
// import { Calendar, Plus, Trash2, GripVertical, Edit3, X } from "lucide-react";
// import {
//   fetchTasks,
//   createTask,
//   updateTask,
//   toggleTaskCompletion,
//   deleteTask,
// } from "../api/task";

// type Task = {
//   _id: string;
//   title: string;
//   description: string;
//   completed: boolean;
//   createdAt: number;
// };

// type TabType = "all" | "todo" | "completed";

// // Sample initial tasks
// // const initialTasks: Task[] = [
// //   {
// //     _id: "1",
// //     title: "Learn React",
// //     description: "Complete React tutorial",
// //     completed: false,
// //     createdAt: Date.now(),
// //   },
// //   {
// //     _id: "2",
// //     title: "Build Todo App",
// //     description: "Create a frontend-only todo application",
// //     completed: false,
// //     createdAt: Date.now() - 100000,
// //   },
// //   {
// //     _id: "3",
// //     title: "Deploy Project",
// //     description: "Deploy the finished project",
// //     completed: true,
// //     createdAt: Date.now() - 200000,
// //   },
// // ];

// const ToDo = () => {
//   const [tasks, setTasks] = useState<Task[]>(() => {
//     // Load from localStorage if available, otherwise use initial tasks
//     const saved = localStorage.getItem("tasks");
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [activeTab, setActiveTab] = useState<TabType>("all");
//   const [newTaskTitle, setNewTaskTitle] = useState("");
//   const [newTaskDescription, setNewTaskDescription] = useState("");
//   const [draggedTask, setDraggedTask] = useState<string | null>(null);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editTitle, setEditTitle] = useState("");
//   const [editDescription, setEditDescription] = useState("");

//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Save tasks to localStorage whenever they change
//   // useEffect(() => {
//   //   localStorage.setItem("tasks", JSON.stringify(tasks));
//   // }, [tasks]);

//   // Fetch tasks on component mount
//   useEffect(() => {
//     const loadTasks = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const apiTasks = await fetchTasks();
//         const tasks = apiTasks.map((task: any) => ({
//           ...task,
//           createdAt:
//             typeof task.createdAt === "string"
//               ? Date.parse(task.createdAt)
//               : task.createdAt,
//         }));
//         setTasks(tasks);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to load tasks");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadTasks();
//   }, []);

//   const filteredTasks = tasks.filter((task) => {
//     if (activeTab === "todo") return !task.completed;
//     if (activeTab === "completed") return task.completed;
//     return true;
//   });

//   // Add a new task
//   // const addTask = () => {
//   //   if (newTaskTitle.trim()) {
//   //     const task: Task = {
//   //       _id: Date.now().toString(),
//   //       title: newTaskTitle.trim(),
//   //       description: newTaskDescription.trim(),
//   //       completed: false,
//   //       createdAt: Date.now(),
//   //     };
//   //     setTasks([...tasks, task]);
//   //     setNewTaskTitle("");
//   //     setNewTaskDescription("");
//   //   }
//   // };
//   const addTask = async () => {
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
//             ? Date.parse(task.createdAt)
//             : task.createdAt,
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

//   // Toggle task completion status
//   // const toggleTask = (_id: string) => {
//   //   setTasks(
//   //     tasks.map((task) =>
//   //       task._id === _id ? { ...task, completed: !task.completed } : task
//   //     )
//   //   );
//   // };

//   const toggleTask = async (id: string) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const updatedTask = await toggleTaskCompletion(id);
//       const normalizedUpdatedTask = {
//         ...updatedTask,
//         createdAt:
//           typeof updatedTask.createdAt === "string"
//             ? Date.parse(updatedTask.createdAt)
//             : updatedTask.createdAt,
//       };
//       setTasks(
//         tasks.map((task) => (task._id === id ? normalizedUpdatedTask : task))
//       );
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to update task");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Delete a task
//   // const deleteTask = (id: string) => {
//   //   setTasks(tasks.filter((task) => task._id !== id));
//   //   if (selectedTask && selectedTask._id === id) {
//   //     closeModal();
//   //   }
//   // };

//   const deleteTaskHandler = async (id: string) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       await deleteTask(id);
//       setTasks((tasks) => tasks.filter((task) => task._id !== id));
//       if (selectedTask && selectedTask._id === id) {
//         closeModal();
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to delete task");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Save edited task
//   // const saveEdit = () => {
//   //   if (selectedTask && editTitle.trim()) {
//   //     const updatedTasks = tasks.map((task) =>
//   //       task._id === selectedTask._id
//   //         ? {
//   //             ...task,
//   //             title: editTitle.trim(),
//   //             description: editDescription.trim(),
//   //             updatedAt: Date.now(),
//   //           }
//   //         : task
//   //     );
//   //     setTasks(updatedTasks);
//   //     setSelectedTask({
//   //       ...selectedTask,
//   //       title: editTitle.trim(),
//   //       description: editDescription.trim(),
//   //     });
//   //     setIsEditing(false);
//   //   }
//   // };

//   const saveEdit = async () => {
//     if (!selectedTask || !editTitle.trim()) return;

//     setIsLoading(true);
//     setError(null);
//     try {
//       const updatedTask = await updateTask(selectedTask._id, {
//         title: editTitle,
//         description: editDescription,
//       });
//       const normalizedUpdatedTask = {
//         ...updatedTask,
//         createdAt:
//           typeof updatedTask.createdAt === "string"
//             ? Date.parse(updatedTask.createdAt)
//             : updatedTask.createdAt,
//       };
//       setTasks(
//         tasks.map((task) =>
//           task._id === selectedTask._id ? normalizedUpdatedTask : task
//         )
//       );
//       setSelectedTask(normalizedUpdatedTask);
//       setIsEditing(false);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to update task");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Open task modal
//   const openTaskModal = (task: Task) => {
//     setSelectedTask(task);
//     setEditTitle(task.title);
//     setEditDescription(task.description || "");
//     setIsModalOpen(true);
//     setIsEditing(false);
//   };

//   // Close modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedTask(null);
//     setIsEditing(false);
//   };

//   // Drag and drop handlers
//   const handleDragStart = (e: React.DragEvent, taskId: string) => {
//     setDraggedTask(taskId);
//     e.dataTransfer.effectAllowed = "move";
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = "move";
//   };

//   const handleDrop = (e: React.DragEvent, dropTaskId: string) => {
//     e.preventDefault();

//     if (!draggedTask || draggedTask === dropTaskId) return;

//     const draggedIndex = tasks.findIndex((task) => task._id === draggedTask);
//     const dropIndex = tasks.findIndex((task) => task._id === dropTaskId);

//     const newTasks = [...tasks];
//     const [draggedTaskObj] = newTasks.splice(draggedIndex, 1);
//     newTasks.splice(dropIndex, 0, draggedTaskObj);

//     setTasks(newTasks);
//     setDraggedTask(null);
//   };

//   // Keyboard shortcut for adding task
//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && e.ctrlKey) {
//       addTask();
//     }
//   };

//   // Get count of tasks for each tab
//   const getTabCount = (tab: TabType) => {
//     if (tab === "todo") return tasks.filter((t) => !t.completed).length;
//     if (tab === "completed") return tasks.filter((t) => t.completed).length;
//     return tasks.length;
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
//       {/* Main container with fixed min-height */}
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl p-6 h-[85vh] flex flex-col">
//         {/* Header */}
//         <div className="flex items-center gap-3 mb-6">
//           <Calendar className="w-6 h-6 text-gray-700" />
//           <h1 className="text-2xl font-bold text-gray-800">To-Do List</h1>
//         </div>

//         {/* Tabs */}
//         <div className="flex bg-gray-100 rounded-full p-1 mb-6">
//           {(["all", "todo", "completed"] as TabType[]).map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
//                 activeTab === tab
//                   ? "bg-orange-500 text-white shadow-md"
//                   : "text-gray-600 hover:text-gray-800"
//               }`}
//             >
//               {tab === "all" ? "All" : tab === "todo" ? "To-Do" : "Completed"} (
//               {getTabCount(tab)})
//             </button>
//           ))}
//         </div>

//         {/* Add Task Form */}
//         <div className="space-y-3 mb-6">
//           <input
//             type="text"
//             placeholder="Task title"
//             value={newTaskTitle}
//             onChange={(e) => setNewTaskTitle(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="w-full block bg-gray-100 border-0 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:bg-white"
//           />
//           <textarea
//             placeholder="Task description (optional)"
//             value={newTaskDescription}
//             onChange={(e) => setNewTaskDescription(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="w-full block bg-gray-100 border-0 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:bg-white resize-none"
//             rows={2}
//           />
//           <button
//             onClick={addTask}
//             disabled={!newTaskTitle.trim()}
//             className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? (
//               "Adding..."
//             ) : (
//               <>
//                 ADD TASK <Plus className="inline w-4 h-4 ml-2" />
//               </>
//             )}
//           </button>
          
//           {/* Show error message if failed to add task */}
//           {error && (
//             <div className="text-red-500 text-sm mt-1" role="alert">
//               {error}
//             </div>
//           )}
//         </div>

//         {/* Task List Container - Fixed height with flex-grow */}
//         {/* <div className="flex-grow min-h-[300px]"> */}
//         {/* Task List - Scrollable area */}
//         <div className="space-y-3 h-full overflow-y-auto">
//           {filteredTasks.length > 0 ? (
//             filteredTasks.map((task) => (
//               <div
//                 key={task._id}
//                 draggable
//                 onDragStart={(e) => handleDragStart(e, task._id)}
//                 onDragOver={handleDragOver}
//                 onDrop={(e) => handleDrop(e, task._id)}
//                 className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-move hover:bg-gray-50 ${
//                   draggedTask === task._id ? "opacity-50" : ""
//                 }`}
//               >
//                 <GripVertical className="w-4 h-4 text-gray-400" />
//                 <button
//                   onClick={() => toggleTask(task._id)}
//                   className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
//                     task.completed
//                       ? "bg-orange-500 border-orange-500"
//                       : "border-gray-300 hover:border-orange-500"
//                   }`}
//                 >
//                   {task.completed && (
//                     <svg
//                       className="w-3 h-3 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M5 13l4 4L19 7"
//                       />
//                     </svg>
//                   )}
//                 </button>
//                 <button
//                   onClick={() => openTaskModal(task)}
//                   className={`flex-1 text-left transition-all duration-200 hover:text-orange-600 ${
//                     task.completed
//                       ? "text-gray-500 line-through"
//                       : "text-gray-800"
//                   }`}
//                 >
//                   {task.title}
//                   {task.description && (
//                     <div className="text-xs text-gray-400 mt-1 truncate">
//                       {task.description}
//                     </div>
//                   )}
//                 </button>
//                 <button
//                   onClick={() => deleteTaskHandler(task._id)}
//                   className="text-gray-400 hover:text-red-500 transition-colors duration-200"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>
//             ))
//           ) : (
//             // Empty state that takes up same space
//             <div className="h-full flex flex-col items-center justify-center text-gray-500">
//               <Calendar className="w-12 h-12 mb-3 opacity-50" />
//               <p className="text-center">
//                 {activeTab === "todo"
//                   ? "No pending tasks!"
//                   : activeTab === "completed"
//                   ? "No completed tasks yet."
//                   : "No tasks yet. Add one above!"}
//               </p>
//             </div>
//           )}
//         </div>
//         {/* </div> */}
//       </div>

//       {/* Modal */}
//       {isModalOpen && selectedTask && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-gray-800">Task Details</h2>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setIsEditing(!isEditing)}
//                   className="text-gray-500 hover:text-orange-500 transition-colors duration-200"
//                 >
//                   <Edit3 className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={closeModal}
//                   className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             {/* Modal Content */}
//             {isEditing ? (
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Title
//                   </label>
//                   <input
//                     value={editTitle}
//                     onChange={(e) => setEditTitle(e.target.value)}
//                     className="w-full p-2 border rounded-lg"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     value={editDescription}
//                     onChange={(e) => setEditDescription(e.target.value)}
//                     className="w-full p-2 border rounded-lg resize-none"
//                     rows={4}
//                   />
//                 </div>
//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={saveEdit}
//                     className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
//                   >
//                     Save Changes
//                   </button>
//                   <button
//                     onClick={() => setIsEditing(false)}
//                     className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div>
//                   <h3
//                     className={`text-lg font-semibold ${
//                       selectedTask.completed
//                         ? "text-gray-300 line-through"
//                         : "text-gray-800"
//                     }`}
//                   >
//                     {selectedTask.title}
//                   </h3>
//                   <div
//                     className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
//                       selectedTask.completed
//                         ? "bg-green-100 text-green-800"
//                         : "bg-orange-100 text-orange-800"
//                     }`}
//                   >
//                     {selectedTask.completed ? "Completed" : "Pending"}
//                   </div>
//                 </div>

//                 {selectedTask.description && (
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-700 mb-2">
//                       Description
//                     </h4>
//                     <p className="text-gray-600 leading-relaxed">
//                       {selectedTask.description}
//                     </p>
//                   </div>
//                 )}

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={() => {
//                       toggleTask(selectedTask._id);
//                       closeModal();
//                     }}
//                     className={`flex-1 py-2 px-4 rounded-lg text-white ${
//                       selectedTask.completed
//                         ? "bg-gray-500 hover:bg-gray-600"
//                         : "bg-green-500 hover:bg-green-600"
//                     }`}
//                   >
//                     Mark as {selectedTask.completed ? "Pending" : "Completed"}
//                   </button>
//                   <button
//                     onClick={() => deleteTaskHandler(selectedTask._id)}
//                     className="py-2 px-4 rounded-lg border border-red-600 text-red-600 hover:bg-red-50"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ToDo;
