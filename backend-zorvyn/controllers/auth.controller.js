import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {userModel} from "../models/user.model.js"
import {userSchema} from "../schema.js"


const register = async (req, res) => {
    const {name, email, password, role, isActive} = req.body;

    let createdUser = await userModel.create({
        name,
        email,
        password,
        role,
        isActive
    })
    res.send("Registered")
    
}

const login = async (req, res) => {
    const {email, password} =req.body;
    if(password.length < 6) {
        return res.status(401).json("Password must be equal or greater than 6");
    }
    const user = await userModel.findOne({email});
    if(!user) return res.send("Something went wrong");
    // console.log(user);
    // console.log(user.password);
    bcrypt.compare(password, user.password, (err, result) => {
        if(!result) {
            try{
                // console.log("");
                return res.status(401).json({message: "Email or password is incorrect"})
            } catch(err){
                console.log(err);
            }
        }
        let token = jwt.sign({ 
            email: user.email, 
            role: user.role, 
            id: user._id 
        },
            process.env.JWT_SECRET
        );
        // let token = jwt.sign({email}, process.env.JWT_SECRET);
        res.cookie("token", token);
        res.status(202).json({token});
        // res.send("Logged In");

    });
    
}

const logout = (req, res) => {
    res.cookie("token", "");
    res.send("Logged out")
}

export { register, login, logout};