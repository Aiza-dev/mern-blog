import { Router } from "express";
import { dashboardController } from "../controllers/dashboardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, dashboardController.getStats);

export default router;
