import Courses from "../models/Courses.js"
import Lecture from "../models/Lecture.js";
import User from "../models/User.js";
import { rm } from "fs/promises";
import { promisify } from "util";
import fs from "fs";
import Progress from "../models/Progress.js";
import { instance } from "../index.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Courses.find();
        res.json({
            courses,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
}

export const getSingleCourses = async (req, res) => {
    try {
        const courses = await Courses.findById(req.params.id);
        res.json({
            courses,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
}

export const fetchLectures = async (req, res) => {
    try {
        const lectures = await Lecture.find({ course: req.params.id });

        const user = await User.findById(req.user._id);

        if (user.role === "admin") {
            return res.json({ lectures })
        }
        if (user.role === "Instructor") {
            return res.json({ lectures })
        }

        // for user = student
        res.json({ lectures })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
}


//fetch lecture by lecture id
export const fetchLecture = async (req, res) => {
    try {
        const lecture = await Lecture.findById(req.params.id);

        const user = await User.findById(req.user._id);

        if (user.role === "admin") {
            return res.json({ lecture })
        }
        if (user.role === "Instructor") {
            return res.json({ lecture })
        }

        // for user = student
        // res.json({ lecture })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
}

export const deleteLecture = async (req, res) => {
    try {
        const lecture = await Lecture.findById(req.params.id);

        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        // Check if the lecture has a video before attempting to delete
        if (lecture.video) {
            try {
                await rm(lecture.video);
                console.log('Lecture video deleted');
            } catch (err) {
                console.error('Error deleting video file:', err);
                // Handle potential errors, such as file not existing
            }
        }

        await lecture.deleteOne();

        res.json({ message: "Responce Lecture is deleted" })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
}



const unlinkAsync = promisify(fs.unlink);

export const deleteCourse = async (req, res) => {
    try {
        const course = await Courses.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const lectures = await Lecture.find({ course: course._id });

        await Promise.all(
            lectures.map(async (lecture) => {
                if (lecture.video) {
                    try {
                        await unlinkAsync(lecture.video);
                        console.log('Video deleted');
                    } catch (err) {
                        console.error('Error deleting video file:', err);
                    }
                }
            })
        );

        if (course.image) {
            try {
                await unlinkAsync(course.image);
                console.log('Course image deleted');
            } catch (err) {
                console.error('Error deleting course image file:', err);
            }
        }

        await Lecture.deleteMany({ course: req.params.id });
        await course.deleteOne();

        res.json({ message: 'Course Deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server error occurred.');
    }
};


export const getMyCourses = async (req, res) => {
    try {
        const courses = await Courses.find({ _id: req.user.subscription });

        res.json({ courses, })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
};

export const checkout = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const course = await Courses.findById(req.params.id);

        if (user.subscription.includes(course._id)) {
            return res.status(400).json({
                message: "You already have this course",
            });
        }

        const options = {
            amount: Number(course.price * 100),
            currency: "INR",
        };

        const order = await instance.orders.create(options);

        res.status(201).json({
            order,
            course,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
};

export const paymentVerification = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac("sha256", process.env.Razorpay_Secret).update(body).digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            await Payment.create({
                razorpay_order_id, razorpay_payment_id, razorpay_signature,
            });

            const user = await User.findById(req.user._id)

            const course = await Courses.findById(req.params.id)

            user.subscription.push(course._id)
            await user.save()

            return res.status(200).json({
                message: "Course Purchased Successfully",
            })
        } else {
            return res.status(400).json({
                message: "Payment failed"
            })
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
};


export const addProgress = async (req, res) => {
    try {
        const progress = await Progress.findOne({
            user: req.user._id,
            course: req.query.course,
        });

        const { lecturesId } = req.query;

        if (progress.completedLectures.includes(lecturesId)) {
            return res.json({
                message: "Progress recorded",
            });
        }

        progress.completedLectures.push(lecturesId);

        await progress.save();

        res.status(201).json({
            message: "new Progress added",
        });


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured.")
    }
}



export const getYourProgress = async (req, res) => {
    try {
        let progress = await Progress.findOne({
            user: req.user._id,
            course: req.query.course,
        });

        const allLectures = (await Lecture.find({ course: req.query.course })).length;

        // If progress does not exist, create a new entry
        if (!progress) {
            progress = await Progress.create({
                course: req.query.course,
                completedLectures: [],
                user: req.user._id,
            });
        }

        const completedLectures = progress.completedLectures.length;
        const courseProgressPercentage = allLectures === 0 ? 0 : (completedLectures * 100) / allLectures;

        res.json({
            courseProgressPercentage,
            completedLectures,
            allLectures,
            progress,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occurred.");
    }
};
