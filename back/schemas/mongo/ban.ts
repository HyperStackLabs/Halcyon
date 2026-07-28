import mongoose from "mongoose";

export const bannedUserSchema = new mongoose.Schema({
    userName: {type: String, required: true}
})