import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
 

  // Here you would typically check the credentials against a database


  try {
    const { email, password } = req.body;// Extract email and password from request body
    const user = await User.findOne({ email });// Find user by email
    if (!user) {
       res.status(404).json({ succes: false,error:"usernotfound" });// If user not found, return 404
    }
    const isMatch = await bcrypt.compare(password,user.password);// Compare provided password with stored hashed password
    if (!isMatch) {
      return res.status(404).json({succes: false,error:"Wrong password"   });// If password does not match, return 401
    }
    // If credentials are valid, you can return a success response or token
    const token=jwt.sign({ _id: user._id, role: user.role }, 
        process.env.JWT_SECRET, { expiresIn: '2h' });
    // Generate JWT token with user ID and role

    res.status(200)
    .json({ 
        success: true,
         token, user: { _id: user._id, name: user.name, role: user.role }
         });
    // Return success response with token and user details


    



    
    
  } catch (error) {
    
    res.status(500).json({ success: false, error: "Server error" });// If an error occurs, return 500
    
  }
}

const verify=(req, res) => {
    return res.status(200).json({ success: true, user: req.user });// If verification is successful, return user data
}
export  {login,verify};