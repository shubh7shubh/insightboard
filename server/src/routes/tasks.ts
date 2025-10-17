import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  updateTaskStatus,
  deleteTask,
  getTaskStatistics,
} from "../controllers/taskController.js";

const router = Router();

// GET /api/tasks - Get all tasks
router.get("/", getAllTasks);

// GET /api/tasks/stats - Get task statistics for charts
router.get("/stats", getTaskStatistics);

// GET /api/tasks/:id - Get specific task
router.get("/:id", getTaskById);

// PATCH /api/tasks/:id - Update task status
router.patch("/:id", updateTaskStatus);

// DELETE /api/tasks/:id - Delete task
router.delete("/:id", deleteTask);

export default router;
