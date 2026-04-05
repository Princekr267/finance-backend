import express from "express";
import { getAllUsers, updateRole, updateStatus } from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.patch("/:id/role", authMiddleware, roleMiddleware("admin"), updateRole);
router.patch("/:id/status", authMiddleware, roleMiddleware("admin"), updateStatus);

export default router;