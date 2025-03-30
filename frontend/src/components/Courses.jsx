import React, { useState, useEffect } from "react";
import axios from "axios";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({
        name: "",
        description: "",
        author: "",
        duration: "",
    });
    const [editingCourse, setEditingCourse] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userId, setUserId] = useState(null);

    const baseURL = "http://localhost:5000/api"; // Replace with your backend URL

    // Get userId from localStorage when component loads
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            console.error("No userId found in localStorage");
        }
    }, []);

    // Fetch all courses
    const fetchCourses = async () => {
        if (!userId) {
            console.error("No userId available");
            return;
        }
        try {
            const response = await axios.get(`${baseURL}/enrolled-courses/${userId}`);
            setCourses(response.data.courses);
        } catch (error) {
            console.error("Error fetching courses:", error.response?.data?.message || error.message);
        }
    };

    // Add a new course
    const addCourse = async () => {
        const { name, description, author, duration } = newCourse;

        if (!name.trim() || !description.trim() || !author.trim() || !duration.trim()) {
            alert("Please fill in all fields.");
            return;
        }
        if (!userId) {
            console.error("No userId available");
            return;
        }
        try {
            await axios.post(`${baseURL}/add-course`, {
                userId,
                courseName: name,
                description,
                author,
                duration: Number(duration),
            });

            setNewCourse({ name: "", description: "", author: "", duration: "" });
            alert("Course added successfully!");
            fetchCourses();
        } catch (error) {
            console.error("Error adding course:", error.response?.data?.message || error.message);
        }
    };

    // Edit a course
    const editCourse = async () => {
        if (!editingCourse || !userId) {
            console.error("No course or userId available.");
            return;
        }

        const { _id, name, description, author, duration } = editingCourse;

        try {
            await axios.put(`${baseURL}/edit-course`, {
                userId,
                courseId: _id,
                courseName: name,
                description,
                author,
                duration: Number(duration),
            });

            setEditingCourse(null);
            alert("Course updated successfully!");
            fetchCourses();
        } catch (error) {
            console.error("Error editing course:", error.response?.data?.message || error.message);
        }
    };

    // Delete a course
    const deleteCourse = async (courseId) => {
        if (!userId) {
            console.error("No userId available");
            return;
        }
        try {
            await axios.delete(`${baseURL}/delete-course`, { data: { userId, courseId } });
            setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId));
            alert("Course deleted successfully!");
        } catch (error) {
            console.error("Error deleting course:", error.response?.data?.message || error.message);
        }
    };

    // Change password
    const changePassword = async () => {
        if (!userId) {
            console.error("No userId available");
            return;
        }
        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("Please fill in all fields");
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("New password and confirm password do not match");
            return;
        }
        try {
            const response = await axios.put(`${baseURL}/change-password`, {
                userId,
                oldPassword,
                newPassword,
                confirmPassword,
            });
            alert(response.data.message || "Password changed successfully!");
            setShowPasswordModal(false);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Error changing password:", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Error changing password");
        }
    };

    // Fetch courses when userId is available
    useEffect(() => {
        if (userId) {
            fetchCourses();
        }
    }, [userId]);

    return (
        <div>
            <h2>My Courses</h2>

            {/* Add Course */}
            <div>
                <input
                    type="text"
                    placeholder="Course Name"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Author"
                    value={newCourse.author}
                    onChange={(e) => setNewCourse({ ...newCourse, author: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Duration (in hours)"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                />
                <button onClick={addCourse}>Add Course</button>
            </div>

            {/* Course List */}
            <ul>
                {courses.map((course) => (
                    <li key={course._id}>
                        <strong>{course.name}</strong> - {course.description} by {course.author} ({course.duration} hours)
                        <button onClick={() => setEditingCourse(course)}>Edit</button>
                        <button onClick={() => deleteCourse(course._id)}>Delete</button>
                    </li>
                ))}
            </ul>

            {/* Edit Course Modal */}
            {editingCourse && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit Course</h3>
                        <input
                            type="text"
                            placeholder="Course Name"
                            value={editingCourse.name}
                            onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={editingCourse.description}
                            onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Author"
                            value={editingCourse.author}
                            onChange={(e) => setEditingCourse({ ...editingCourse, author: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Duration (in hours)"
                            value={editingCourse.duration}
                            onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                        />
                        <button onClick={editCourse}>Update Course</button>
                        <button onClick={() => setEditingCourse(null)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Change Password Button */}
            <button onClick={() => setShowPasswordModal(true)}>Change Password</button>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Change Password</h3>
                        <input
                            type="password"
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button onClick={changePassword}>Update Password</button>
                        <button onClick={() => setShowPasswordModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Basic Modal CSS */}
            <style>
                {`
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .modal-content {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                .modal-content input {
                    width: 100%;
                    margin: 10px 0;
                    padding: 8px;
                }
                .modal-content button {
                    margin: 5px;
                    padding: 8px 12px;
                    cursor: pointer;
                }
                `}
            </style>
        </div>
    );
};

export default Courses;
