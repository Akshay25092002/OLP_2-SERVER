import express from 'express';
import { fetchLecture, fetchLectures, getAllCourses, getMyCourses, getSingleCourses } from '../controllers/course.js';
import fetchuser from '../middlewares/fetchuser.js';
import { isAuth } from '../controllers/user.js';

const router = express.Router();

router.get("/course/all", getAllCourses);
router.get("/course/:id", getSingleCourses);
router.get("/lectures/:id", fetchuser, isAuth, fetchLectures);
router.get("/lecture/:id", fetchuser, isAuth, fetchLecture);
router.get("/mycourse", fetchuser, isAuth, getMyCourses);

export default router;