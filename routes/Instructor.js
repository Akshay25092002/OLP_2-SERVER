import express from 'express';
import { isAuth } from '../controllers/user.js';
import { addLecture, createCourse } from '../controllers/admin.js';
import fetchuser, { isInstructor } from '../middlewares/fetchuser.js';
import { uploadFiles } from '../middlewares/multer.js';
import { deleteCourse, deleteLecture } from '../controllers/course.js';

const router = express.Router();

router.post("/course/new", fetchuser, isAuth, isInstructor, uploadFiles, createCourse);
router.post("/instructor/course/:id", fetchuser, isAuth, isInstructor, uploadFiles, addLecture);
router.delete("/instructor/course/:id", fetchuser, isAuth, isInstructor, deleteCourse);
router.delete("/instructor/lecture/:id", fetchuser, isAuth, isInstructor, deleteLecture);



export default router;