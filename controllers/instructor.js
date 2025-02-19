import Courses from '../models/Courses.js';

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