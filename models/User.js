import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    subscription: [
        {
            type: mongoose.Schema.Types.ObjectId,
            default: [],
            ref: "Courses",
        },
    ],

}, {
    timestamps: true,
});

const User = model("users", UserSchema);
export default User;