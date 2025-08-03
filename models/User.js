import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"],required:true },// Role can be 'admin' or 'user'
    profileImage: { type: String }, // URL to the profile image
    createdAt: { type: Date, default: Date.now },// Timestamp for when the user was created
    updatedAt: { type: Date, default: Date.now } // Timestamp for when the user was last updated

})

const User = mongoose.model("User", userSchema);// Create the User model based on the schema

export default User
// This code defines a Mongoose schema for a User model with fields for name, email,
// password, role, profile image, and timestamps for creation and updates.
// The role field is restricted to either 'admin' or 'user', and the email field        
// is unique to prevent duplicate entries. The profileImage field defaults to an empty string.
