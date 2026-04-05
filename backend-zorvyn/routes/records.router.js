import express from "express";
import { createRecord, getRecords, updateRecord, deleteRecord } from "../controllers/records.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getRecords);
router.post("/", authMiddleware, roleMiddleware("admin", "analyst"), createRecord);
router.patch("/:id", authMiddleware, roleMiddleware("admin"), updateRecord);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteRecord);

export default router;