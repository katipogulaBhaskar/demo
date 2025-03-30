import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './Courses.css';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState('');
    const baseURL = 'http://localhost:5000/api'; // Replace with your backend URL

    // Retrieve userId from localStorage
    const userId = localStorage.getItem('userId');

    // Fetch all courses
    const fetchCourses = async () => {
        if (!userId) {
            console.error('No userId found in localStorage');
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
            console.error('No userId found in localStorage');
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
            console.error('No userId found in localStorage');
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
            console.error('No userId found in localStorage');
            return;
        }
        try {
            await axios.delete(`${baseURL}/delete-course`, { data: { userId, courseId } });
            setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId));
        } catch (error) {
            console.error('Error deleting course:', error.response?.data?.message || error.message);
        }
    };

    // Fetch courses on component mount
    useEffect(() => {
        fetchCourses();
    }, []);

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
        </div>
    );
};

export default Courses;
