import User from "../models/user.model.js"; // Import User model

// Add a new Course
export const addCourse = async (req, res) => {
    const { userId, courseName, description, author, duration } = req.body; // Expect course details in request body

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the course name already exists for the user
        const courseExists = user.courses.some(course => course.name === courseName);
        if (courseExists) {
            return res.status(400).json({ message: "Course with this name already exists" });
        }

        // Add new course with all fields
        user.courses.push({
            name: courseName,
            description,
            author,
            duration
        });

        await user.save();

        res.status(201).json({ message: "Course added successfully", courses: user.courses });
    } catch (error) {
        res.status(500).json({ message: "Error adding course", error: error.message });
    }
};

// Edit an existing Course
export const editCourse = async (req, res) => {
    const { userId, courseId, courseName, description, author, duration } = req.body; // Course details to update

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const course = user.courses.id(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Update course fields
        if (courseName) course.name = courseName;
        if (description) course.description = description;
        if (author) course.author = author;
        if (duration) course.duration = duration;

        await user.save();

        res.status(200).json({ message: "Course updated successfully", courses: user.courses });
    } catch (error) {
        res.status(500).json({ message: "Error updating course", error: error.message });
    }
};

// Delete a Course
export const deleteCourse = async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const courseIndex = user.courses.findIndex(course => course._id.toString() === courseId);

        if (courseIndex === -1) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Remove course by index
        user.courses.splice(courseIndex, 1);
        await user.save();

        res.status(200).json({ message: "Course deleted successfully", courses: user.courses });
    } catch (error) {
        res.status(500).json({ message: "Error deleting course", error: error.message });
    }
};

// Fetch all Courses for a User
export const fetchAllCourses = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Courses fetched successfully", courses: user.courses });
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses", error: error.message });
    }
};
