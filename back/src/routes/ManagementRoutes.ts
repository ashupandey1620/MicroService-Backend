import { Router } from "express";

import { authenticateToken } from "../middleware/authMiddleware";
import managementController from "../controllers/managementController";

const router = Router();

//candidates data routes
router.post("/MStaff", authenticateToken, managementController.addCandidate);
router.post("/ManyMStaff", authenticateToken, managementController.addManyCandidate);
router.get("/MStaff", authenticateToken, managementController.getAllCandidate);

router.get("/deleteMStaff/:id", authenticateToken, managementController.deleteManagementTeam);
router.get("/deleteAllMStaff", authenticateToken, managementController.deleteAllManagement);

router.get("/getUserProfile", authenticateToken, managementController.getUserProfile);

router.post("/public/profile",  managementController.getUserProfilePublic);
router.get("/public/candidate",  managementController.getAllCandidatesPublic);
router.post('/protected', authenticateToken, managementController.protectedFun);



export default router;
