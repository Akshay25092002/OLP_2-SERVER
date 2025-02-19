import express from 'express';
import { isAuth } from '../controllers/user.js';
import { addLecture, createCourse, getAllStates, getAllUser, updateRole } from '../controllers/admin.js';
import fetchuser, { isAdmin } from '../middlewares/fetchuser.js';
import { uploadFiles } from '../middlewares/multer.js';
import { deleteCourse, deleteLecture } from '../controllers/course.js';

const router = express.Router();

router.post("/course/new", fetchuser, isAuth, isAdmin, uploadFiles, createCourse);
router.post("/course/:id", fetchuser, isAuth, isAdmin, uploadFiles, addLecture);
router.delete("/course/:id", fetchuser, isAuth, isAdmin, deleteCourse);
router.delete("/lecture/:id", fetchuser, isAuth, isAdmin, deleteLecture);
router.get("/stats", fetchuser, isAuth, isAdmin, getAllStates)
router.get("/users", fetchuser, isAuth, isAdmin, getAllUser);
router.put("/user/:id", fetchuser, isAuth, isAdmin, updateRole);



export default router;