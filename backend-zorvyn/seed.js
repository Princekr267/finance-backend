import mongoose from "mongoose";
import { userModel } from "./models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

await mongoose.connect(process.env.MongoDB);

await userModel.create({
    name: "Admin",
    email: "admin@finance.com",   // just for testing
    password: "admin123",   // just for testing
    role: "admin"
});

console.log("Admin seeded");
await mongoose.disconnect();