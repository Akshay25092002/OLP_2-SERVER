import express from 'express';
import { isAuth, login, myProfile, register } from '../controllers/user.js';
import { validateRegister } from '../controllers/user.js';
import { validateLogin } from '../controllers/user.js';
import fetchuser from '../middlewares/fetchuser.js';

const router = express.Router();

router.post("/user/register", validateRegister, register);
router.post("/user/login", validateLogin, login);
router.get("/user/getuser", fetchuser, isAuth, myProfile);

export default router;