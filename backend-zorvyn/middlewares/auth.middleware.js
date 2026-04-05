import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import {userSchema} from "../schema.js"
import { userModel } from "../models/user.model.js";

const validateRegister = async (req, res, next) => {
    let {error} = userSchema.validate(req.body);
    // console.log(req.body);
    if(error){
        let errMsg = error.details && Array.isArray(error.details) 
            ? error.details.map((el) => el.message).join(", ")
            : error.message || "Validation error";
        console.log(error);
        return res.status(400).json({ message: errMsg });
    }
    const {email} = req.body;
    let existingUser = await userModel.findOne({email});
    if(existingUser) return res.status(409).json({message: "User already registered"});

    next();
}

const validateLogin = async (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: "Email and password are required"});        
    }
    next();
}

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // get token after "Bearer "

        if(!token) {
            return res.status(401).json({message: "No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select("role isActive");
        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }
        if (!user.isActive) {
            return res.status(403).json({ message: "Account is inactive. Contact an admin." });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid token"});
    }
}

export {authMiddleware, validateRegister, validateLogin};