import Courses from '../models/Courses.js';
import Lecture from '../models/Lecture.js';
import User from '../models/User.js';

export const createCourse = async (req, res) => {
    try {
        const { title, description, duration, category, createdBy } = req.body;

        const image = req.file;

        await Courses.create({
            title,
            description,
            image: image?.path,
            duration,
            category,
            createdBy,
        });

        res.status(201).json({ message: "Course created Successfully." })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }

}


export const addLecture = async (req, res) => {
    try {
        const course = await Courses.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                message: "No Course with this id",
            });
        }
        const { title, description } = req.body;
        const file = req.file;

        const lecture = await Lecture.create({
            title,
            description,
            video: file?.path,
            course: course._id,
        });
        res.status(201).json({
            message: "Lecture Added", lecture,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
}



export const getAllStates = async (req, res) => {
    try {

        const totalCourses = (await Courses.find()).length;
        const totalLectures = (await Lecture.find()).length;
        const totalUsers = (await User.find()).length;

        const stats = {
            totalCourses,
            totalLectures,
            totalUsers,
        };

        res.json({
            stats,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
}

export const getAllUser = async (req, res) => {
    try {

        const users = await User.find({ _id: { $ne: req.user.id } }).select("-password");

        res.json({ users });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
}

export const updateRole = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (user.role === "Student" || user.role === "Instructor") {
            user.role = "admin";
            await user.save();

            return res.status(200).json({
                message: "Role updated to admin"
            });
        }

        if (user.role === "admin") {
            user.role = "Student";
            await user.save();

            return res.status(200).json({
                message: "Role updated to Student"
            });
        }


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
}