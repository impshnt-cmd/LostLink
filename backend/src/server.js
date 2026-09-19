import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.use("/api/items", itemRoutes);

app.use(
  "/api/notifications",
  notificationRoutes
);

// Home
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LostLink Backend is running 🚀",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "LostLink API",
    database: "MongoDB",
    status: "healthy",
  });
});

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});