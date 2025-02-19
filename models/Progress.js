import mongoose from "mongoose";

const { Schema, model } = mongoose;

const progressSchema = new Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
    },
    completedLectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
    },],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});

const Progress = model("Progress", progressSchema);
export default Progress;