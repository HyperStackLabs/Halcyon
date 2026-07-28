import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    userName: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profilePicture: String,
    rateLimit: Number,
    role: {type: String, required: true}
})