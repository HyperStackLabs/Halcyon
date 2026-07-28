import mongoose from "mongoose";
import { conversationSchema } from "../schemas/mongo/chatSchema.js";
import { userSchema } from "../schemas/mongo/authSchema.js";
import { bannedUserSchema } from "../schemas/mongo/ban.js";
import { LLMSchema } from "../schemas/mongo/AIschema.js";

export const conversation = mongoose.model('conversation', conversationSchema)
export const users = mongoose.model('users', userSchema)
export const banlands = mongoose.model('banlands', bannedUserSchema)
export const models = mongoose.model('ai_models', LLMSchema)