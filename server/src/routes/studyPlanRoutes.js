import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    generateStudyPlan,
    getStudyPlan,
    updateChecklist,
} from "../controllers/studyPlanController.js";

const router = express.Router();

router.post("/generate", protect, generateStudyPlan);
router.get("/", protect, getStudyPlan);
router.put("/", protect, updateChecklist);

export default router;
