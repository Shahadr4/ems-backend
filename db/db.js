import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected successfully");
        
    } catch (error) {
        console.log("Database connection failed:", error.message);
        
        
    }
}
export default connectDB;