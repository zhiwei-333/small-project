import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import taskRoutes from "./routes/tasks.js";
import authRoutes from "./routes/auth.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
console.log("Current file:", __filename);
const __dirname = path.dirname(__filename);
console.log("Current directory:", __dirname);
const app = express();

app.use(express.json());

// Middleware
// Configure CORS
const corsOptions = {
  origin: "https://testdeeplink.huozhong.us",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());

// Serve frontend build
// app.use(express.static(path.join(__dirname, "static"))); 

let users = []; // In-memory user store
let refreshTokens = []; // Store valid refresh tokens (DB recommended)

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB connection error:", err));

// Routes
console.log("Registering /api/tasks routes");
app.use("/api/tasks", taskRoutes);

console.log("Registering /api/auth routes");
app.use("/api/auth", authRoutes);

// const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "static")));

// Start server on 0.0.0.0
const HOST = "0.0.0.0";

const PORT = process.env.PORT || 3000;
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});


// app.use(express.static(path.join(__dirname, "../frontend/dist")));
// app.use(express.static(path.join(__dirname, "static")));

// 3. Catch-all SPA fallback last
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "static", "index.html"));
// });
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "dist"))); // change to 'build' if CRA