import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userId, setUserId] = useState(null);

    const baseURL = 'http://localhost:5000/api'; // Replace with your backend URL

    // Get userId from localStorage when component loads
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            console.error('No userId found in localStorage');
        }
    }, []);

    // Fetch all courses
    const fetchCourses = async () => {
        if (!userId) {
            console.error('No userId available');
            return;
        }
        try {
            const response = await axios.get(`${baseURL}/enrolled-courses/${userId}`);
            setCourses(response.data.courses);
        } catch (error) {
            console.error('Error fetching courses:', error.response?.data?.message || error.message);
        }
    };

    // Add a new course
    const addCourse = async () => {
        if (!newCourse.trim()) return;
        if (!userId) {
            console.error('No userId available');
            return;
        }
        try {
            await axios.post(`${baseURL}/add-course`, { userId, courseName: newCourse });
            setNewCourse('');
            alert('Course added successfully!');
            fetchCourses();
        } catch (error) {
            console.error('Error adding course:', error.response?.data?.message || error.message);
        }
    };

    // Edit a course
    const editCourse = async (courseId) => {
        const updatedName = prompt('Edit Course Name:');
        if (!updatedName) return;
        if (!userId) {
            console.error('No userId available');
            return;
        }
        try {
            await axios.put(`${baseURL}/edit-course`, { userId, courseId, newCourseName: updatedName });
            fetchCourses();
        } catch (error) {
            console.error('Error editing course:', error.response?.data?.message || error.message);
        }
    };

    // Delete a course
    const deleteCourse = async (courseId) => {
        if (!userId) {
            console.error('No userId available');
            return;
        }
        try {
            await axios.delete(`${baseURL}/delete-course`, { data: { userId, courseId } });
            setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId));
        } catch (error) {
            console.error('Error deleting course:', error.response?.data?.message || error.message);
        }
    };

    // Change password
    // Change password
const changePassword = async () => {
    if (!userId) {
        console.error('No userId available');
        return;
    }
    if (!oldPassword || !newPassword || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match');
        return;
    }
    try {
        const response = await axios.put(`${baseURL}/change-password`, {
            userId,
            oldPassword,
            newPassword,
            confirmPassword, // ✅ Send confirmPassword to backend
        });
        alert(response.data.message || 'Password changed successfully!');
        setShowPasswordModal(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    } catch (error) {
        console.error('Error changing password:', error.response?.data?.message || error.message);
        alert(error.response?.data?.message || 'Error changing password');
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
                    placeholder="Add a new course"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                />
                <button onClick={addCourse}>Add</button>
            </div>

            {/* Course List */}
            <ul>
                {courses.map((course) => (
                    <li key={course._id}>
                        <span>{course.name}</span>
                        <button onClick={() => editCourse(course._id)}>Edit</button>
                        <button onClick={() => deleteCourse(course._id)}>Delete</button>
                    </li>
                ))}
            </ul>

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
