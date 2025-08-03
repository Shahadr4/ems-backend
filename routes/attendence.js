import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { addAttendence, adminUpdateAttendance, getMonthlyRecords, getTodayStatus } from "../controller/attendenceController.js";



const router = express.Router();

router.post("/add", authMiddleware, addAttendence);


// Add this GET route
router.get("/status", authMiddleware, getTodayStatus);
router.get("/monthly-records/:userId", getMonthlyRecords);
router.put("/update/:userId", adminUpdateAttendance);



export default router;
