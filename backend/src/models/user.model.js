import mongoose from "mongoose";

// User schema with embedded courses
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String }, // For password reset
    courses: [{
        name: { 
            type: String, 
            required: true, 
            unique: true 
        }
    }] // Embedded CourseSchema as an array
});

// Model
const User = mongoose.model("learn", UserSchema);

export default User;
