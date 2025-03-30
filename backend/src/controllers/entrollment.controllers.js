import crypto from "crypto";
import bcrypt from "bcrypt";
//import User from "../models/user.model.js"; // Adjust the path as per your project structure
import User from "../models/user.model.js"; // Assuming you have User and Course models

// Request Password Reset (Generate Token)
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        await user.save();

        // Simulate sending email by logging the token
        console.log(`Password reset token for ${email}: ${resetToken}`);

        res.status(200).json({ message: "Password reset token generated. Check your email." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({ resetToken: token });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = null; // Clear the reset token
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


// Enroll in a course
//import User from "../models/User.js"; // Adjust the path if needed
//import User from "../models/User.js"; // Adjust the path if neede

// Enroll a user in a course (Add a new course)


// Controller for Course Enrollment

// Enroll in a cours

// Add a new Course
export const addCourse = async (req, res) => {
    const { userId, courseName } = req.body; // Expect userId and courseName in the request body

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.courses.push({ name: courseName }); // Add course
        await user.save();

        res.status(201).json({ message: 'Course added successfully', courses: user.courses });
    } catch (error) {
        res.status(500).json({ message: 'Error adding course', error: error.message });
    }
};

// Edit an existing Course Name
export const editCourse = async (req, res) => {
    
    const { userId, courseId, newCourseName } = req.body; // Expect userId, courseId, and new name

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const course = user.courses.id(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.name = newCourseName; // Update course name
        await user.save();

        res.status(200).json({ message: 'Course updated successfully', courses: user.courses });
    } catch (error) {
        res.status(500).json({ message: 'Error updating course', error: error.message });
    }
};

// Delete a Course
export const deleteCourse = async (req, res) => {
    const { userId, courseId } = req.body; // Expect userId and courseId

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.courses.pull({ _id: courseId }); // Remove course by ID
        await user.save();

        res.status(200).json({ message: 'Course deleted successfully', courses: user.courses });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course', error: error.message });
    }
};

// Fetch all Courses for a User
export const fetchAllCourses = async (req, res) => {
    const { userId } = req.params; // Expect userId in URL params

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Courses fetched successfully', courses: user.courses });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
};
