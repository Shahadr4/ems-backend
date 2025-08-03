import express from "express";
import {
  addEmployee,
  getEmployees,
  upload,
  getSingleEmployee,
} from "../controller/employeeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { updateEmployee } from "../controller/employeeController.js";
import { deleteEmployee } from "../controller/employeeController.js";


const router = express.Router();

router.post("/add", authMiddleware, upload.single("profileImage"), addEmployee);
router.get("/", authMiddleware, getEmployees);
router.put("/edit/:id", upload.single("profileImage"), authMiddleware, updateEmployee);
router.get("/:id", authMiddleware, getSingleEmployee);
router.delete("/:id", authMiddleware, deleteEmployee);


export default router;
