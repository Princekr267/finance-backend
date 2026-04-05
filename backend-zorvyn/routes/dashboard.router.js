import express from "express";
import { getSummary, getByCategory, getMonthlyTrends } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.get("/summary", authMiddleware, getSummary);
router.get("/by-category", authMiddleware, getByCategory);
router.get("/trends", authMiddleware, getMonthlyTrends);

export default router;