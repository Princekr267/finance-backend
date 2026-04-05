import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {userModel} from "../models/user.model.js"
import {userSchema} from "../schema.js"

const register = async (req, res) => {
  try {
    const {name, email, password} = req.body;
    await userModel.create({ name, email, password });
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message).join(", ");
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: "Server error" });
  }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(401).json({message: "Email or password is incorrect"});
        }

        if (!user.isActive) {
            return res.status(403).json({message: "Account is inactive. Contact an admin."});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({message: "Email or password is incorrect"});
        }
        
        const token = jwt.sign({ 
            email: user.email, 
            role: user.role, 
            id: user._id 
        },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({token});
    } catch(err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
}

export { register, login, logout};