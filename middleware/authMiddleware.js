import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res,next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
        return res.status(404).json({ success: false, error: "No token provided" }); // If no token, return 404

    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    if(!decoded) {
        return res.status(401).json({ success: false, error: "Invalid token" }); // If token is invalid, return 401
    }
    const user = await User.findById({_id:decoded._id}).select('-password')// Find user by ID from token
    // If user is found, attach user data to request object
    if (!user) {
        return res.status(404).json({ success: false, error: "User not found" }); // If user not found, return 404
    }
    // Attach user data to request object
    req.user = user; // Attach user data to request object
    next(); // Call next middleware
    
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" }); // If an error occurs, return 500
    
  }
}
export default authMiddleware;