import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      required: true,
    },
    profileImage: {
      data: String,         // Base64 encoded image string
      contentType: String,  // MIME type (e.g., 'image/jpeg')
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

const User = mongoose.model("User", userSchema);
export default User;
