import mongoose from "mongoose";

const { Schema, model } = mongoose;

const LectureSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

const Lecture = model("lectures", LectureSchema);
export default Lecture;