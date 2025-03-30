
import User from "../models/user.model.js"; // Assuming you have User and Course mode;

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
