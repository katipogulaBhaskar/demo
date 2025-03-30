import express from "express";
import { logInUser, signUpUser, logoutUser, changePassword } from '../controllers/user.controllers.js';


import {
    addCourse,
    fetchAllCourses,
    editCourse, deleteCourse
} from "../controllers/entrollment.controllers.js"; // Adjust the path

const router = express.Router();

router.post('/signupUser', signUpUser);

router.post('/loginUser', logInUser);

router.post('/logout', logoutUser);

router.put('/change-password', changePassword);


// Course enrollment routes
router.post('/add-course', addCourse); // Add a course
router.put('/edit-course', editCourse); // Edit a course
router.delete('/delete-course', deleteCourse); // Delete a course
router.get('/enrolled-courses/:userId', fetchAllCourses); // Fetch all courses

export default router;