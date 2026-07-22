import mongoose from "mongoose";
import { chatlogSchema, conversationSchema } from "../schemas/mongo/chatSchema.js";

export const conversation = mongoose.model('conversation', conversationSchema)
export const chats = mongoose.model('chats', chatlogSchema)