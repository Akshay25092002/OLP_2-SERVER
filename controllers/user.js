import User from '../models/User.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Validation middleware
export const validateRegister = [
    body('name', 'Enter a valid name.').isLength({ min: 3 }),
    body('email', 'Enter a valid & unique email.').isEmail(),
    body('password', 'Password must be at least 5 characters.').isLength({ min: 5 }),
];

export const validateLogin = [
    body('email', 'Enter a valid Email.').isEmail(),
    body('password', 'Enter a valid password').exists(),
];

export const register = async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    let success = false;
    //if there are errors return bad request and error
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success, error: error.array() });
    }
    try {
        //check whether the user with email alredy exists in DB
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "Sorry a user with this email alredy exists." })
        }
        const salt = await bcrypt.genSalt(10);  // Hashing password
        const securePass = await bcrypt.hash(req.body.password, salt);
        // Create database in User model
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securePass,
            role: req.body.role,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });  //res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    let success = false;
    //if there are errors return bad request and error
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }
    const { email, password } = req.body;
    try {
        //check whether email exists in DB
        let user = await User.findOne({ email });
        if (!user) {
            success = false;
            return res.status(400).json({ success, error: "Please try to login with correct credential." })
        }
        //comparing passsword with db password
        const passwordCompare = await bcrypt.compare(password, user.password); //return true/false
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, error: "Please try to login with correct credential." })
        }
        // taking obj data(with user id) to make JWT roken access
        const data = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        console.log({ success, authToken });
        res.json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
}

//if User is Autheticated then:
export const isAuth = async (req, res, next) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password");
        //res.send(user);

        req.user = user;

        next();
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
}


//get profile
export const myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({ user });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }

};
