import { Router } from "express";

import { authenticateToken } from "../middleware/authMiddleware";
import managementController from "../controllers/managementController";

const router = Router();

//candidates data routes
router.post("/car", authenticateToken, managementController.addCar);
router.get("/getAllCar", authenticateToken, managementController.getAllCar);

router.get("/deleteCar/:id", authenticateToken, managementController.deleteCar);
router.get("/deleteAllCar", authenticateToken, managementController.deleteAllCar);

export default router;
