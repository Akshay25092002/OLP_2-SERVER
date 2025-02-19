import express from 'express';
import { checkout, fetchLecture, fetchLectures, getAllCourses, getMyCourses, getSingleCourses, paymentVerification } from '../controllers/course.js';
import fetchuser from '../middlewares/fetchuser.js';
import { isAuth } from '../controllers/user.js';

const router = express.Router();

router.get("/course/all", getAllCourses);
router.get("/course/:id", getSingleCourses);
router.get("/lectures/:id", fetchuser, isAuth, fetchLectures);
router.get("/lecture/:id", fetchuser, isAuth, fetchLecture);
router.get("/mycourse", fetchuser, isAuth, getMyCourses);
router.post("/course/checkout/:id", fetchuser, isAuth, checkout);
router.post("/verification/:id", fetchuser, isAuth, paymentVerification);


export default router;