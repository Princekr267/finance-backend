import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import {userSchema} from "../schema.js"
import { userModel } from "../models/user.model.js";

const validateRegister = async (req, res, next) => {
    let {error} = userSchema.validate(req.body);
    console.log(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(", ");
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
        return res.status(409).json({message: "Email and password is required"});        
    }
    // return res.status(200).json({message: "OK"});
    next();
}

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if(!token) {
            return res.status(401).json({message: "No token provided"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid token"});
    }
}

export {authMiddleware, validateRegister, validateLogin};