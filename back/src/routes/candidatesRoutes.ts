import { Router } from "express";

import { authenticateToken } from "../middleware/authMiddleware";
import candidateController from "../controllers/candidateController";

const router = Router();

//candidates data routes
router.post("/MStaff", authenticateToken, candidateController.addCandidate);
router.post("/ManyMStaff", authenticateToken, candidateController.addManyCandidate);
router.get("/MStaff", authenticateToken, candidateController.getAllCandidate);

router.get("/deleteMStaff/:id", authenticateToken, candidateController.deleteCandidate);
router.get("/deleteAllMStaff", authenticateToken, candidateController.deleteAllCandidate);

router.get("/getUserProfile", authenticateToken, candidateController.getUserProfile);

router.post("/public/profile",  candidateController.getUserProfilePublic);
router.get("/public/candidate",  candidateController.getAllCandidatesPublic);
router.post('/protected', authenticateToken, candidateController.protectedFun);



export default router;
