import mongoose from "mongoose"
export const LLMSchema = new mongoose.Schema({
    soft_name: {type: String, unique: true, required: true},
    image: {type: String, required: true},
    codename: {type: String, unique: true, required: true},
    type: {type: String, required: true},
    likes: {type: Number, default: 0},
    interaction: {type: Number, default: 0}
})