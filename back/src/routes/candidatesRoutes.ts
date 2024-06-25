import { Router } from "express";

import { authenticateToken } from "../middleware/authMiddleware";
import candidateController from "../controllers/candidateController";

const router = Router();

//candidates data routes
router.post("/candidate", authenticateToken, candidateController.addCandidate);
router.post("/addCandidates", authenticateToken, candidateController.addManyCandidate);
router.get("/candidate", authenticateToken, candidateController.getAllCandidate);

router.get("/deleteCandidate/:id", authenticateToken, candidateController.deleteCandidate);
router.get("/deleteAllCandidate", authenticateToken, candidateController.deleteAllCandidate);

router.get("/getUserProfile", authenticateToken, candidateController.getUserProfile);


router.post("/public/profile",  candidateController.getUserProfilePublic);
router.get("/public/candidate",  candidateController.getAllCandidatesPublic);
router.post('/protected', authenticateToken, candidateController.protectedFun);



export default router;
