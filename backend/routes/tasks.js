import express from "express";
import Task from "../models/Task.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protectRoute);

// GET all tasks
// router.get("/", async (req, res) => {
//   try {
//     const tasks = await Task.find().sort({ createdAt: -1 });
//     res.json(tasks);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// GET all tasks for the authenticated user
router.get("/", async (req, res) => {
  console.log("Backend: Fetching tasks for user:", req.user._id);
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    console.log("Tasks fetched for user:", req.user._id);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single task
// router.get("/:id", async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ message: "Task not found" });
//     res.json(task);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// GET a single task (only if it belongs to the user)
router.get("/:id", async (req, res) => {
  
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new task
router.post("/", async (req, res) => {
  console.log("Creating new task for user:", req.user._id);
  console.log("Request body:", req.body);
  const { title, description = "", completed = false } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  const task = new Task({
    title: title.trim(),
    description: description.trim(),
    completed,
    user: req.user._id, // Authenticated user
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
    console.log("New task created:", newTask._id);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a task
router.put("/:id", async (req, res) => {
  try {
    const { title, description = "", completed } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title: title.trim(),
        description: description.trim(),
        ...(completed !== undefined && { completed }),
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH toggle task completion
router.patch("/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;
    task.updatedAt = Date.now();
    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a task
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
