import express from "express";
import dotenv from "dotenv";
import authentication from "./routes/auth.router.js";
dotenv.config();

import cors from "cors";
import mongoose from "mongoose";

import recordsRouter from "./routes/records.router.js";
import dashboardRouter from "./routes/dashboard.router.js";
import usersRouter from "./routes/users.router.js";

const app = express();
const PORT = process.env.PORT;

const allowedOrigins = [
    'http://localhost:5173',
    'chrome-extension://amknoiejhlmhancpahfcfcfhllgkpbld',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            console.log('CORS blocked origin:', origin);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MongoDB);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("API is Working!");
})

app.use("/api/auth", authentication);
app.use("/api/records", recordsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/users", usersRouter);


app.listen(PORT || 3000, ()=>{
    console.log(`Server is running on port ${PORT || 3000}`)
})