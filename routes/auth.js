import express from 'express';
import { login, verify } from '../controller/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';



const router = express.Router();
// Define your authentication routes here
router.post('/login',login)
// Route for user login, using the login function from authController
router.get('/verify',authMiddleware,verify)
export default router;
 