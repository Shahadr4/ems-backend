import mongoose, { Schema } from "mongoose";

// Define the Employee schema
const employeeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true, // ✅ Automatically adds createdAt and updatedAt
  }
);

// Export the Employee model
const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
