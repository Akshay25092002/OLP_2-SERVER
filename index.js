import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToMongo from "./db.js";
import userRoutes from "./routes/user.js"
import courseRoutes from "./routes/course.js"
import adminRoutes from "./routes/admin.js"
import instructorRoutes from "./routes/Instructor.js"
import Razorpay from "razorpay"

dotenv.config();

export const instance = new Razorpay({
    key_id: process.env.Razorpay_Key,
    key_secret: process.env.Razorpay_Secret,
})

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
    res.send("Server is working");
})

app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);
app.use("/api", instructorRoutes);

app.listen(port, (req, res) => {
    connectToMongo();
    console.log(`Server is Listening on port: ${port}`)
})