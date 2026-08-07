import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    userName: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profilePicture: String,
    role: {type: String, required: true, enum: ['admin', 'user']},
    API_KEY: {type: String, required: true},
    usageCap: {type: Number, required: true}
})