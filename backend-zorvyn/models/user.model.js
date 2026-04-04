import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["viewer", "analyst", "admin"],
        required: true,
        default: "viewer"
    },
    isActive: {
        type: Boolean,
        default: true,  
    }
});

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // console.log(next);
    // next();
}) 

const userModel = mongoose.model("User", UserSchema);
export { userModel };