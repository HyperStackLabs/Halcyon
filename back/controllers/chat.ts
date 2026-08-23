import type { Response, NextFunction } from "express";
import mongoose from "mongoose";
import sendPrompt from "../services/activateChat.js";
import { conversation, users } from "../models/models.js";
import type { AuthRequest } from "../types/authTypes.js";
import { deleteMessageService } from "../services/deleteMessage.js";
import { RepromptService } from "../services/reprompt.js";
export const message = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const id = req?.user?.id
        if (!id) {
            return res.status(401).json({ message: 'Unauthorized.' })
        }
        const {userMessage, LLM, convoId} = req.body
        const foundUser = await users.findById({_id: req?.user?.id}).select('name')
        if (!foundUser) {
            return res.status(404).json({message: 'User is not present'})
        }
        const user = foundUser.name
        const sendMessage = await sendPrompt(
            userMessage,
            convoId,
            user,
            LLM,
            id,
        )
        return res.status(200).json(sendMessage)
    }catch(error){
        next(error)
    }
}
export const getAChat = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const convoId = typeof req.query.convoId === 'string' ? req.query.convoId : undefined
        const userId = req.user?.id
        if(!convoId || !userId || !mongoose.isValidObjectId(convoId)){
            return res.status(400).json({message: 'A conversation ID is required.'})
        }
        const chat = await conversation.findOne({ _id: convoId, user: userId }).lean()
        if (!chat) {
            return res.status(404).json({message: 'Conversation not found.'})
        }
        return res.status(200).json(chat.messages)
    }catch(error){
        next(error)
    }
}
export const deleteMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const {messageID} = req.body
        const userId = req.user?.id
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized.' })
        }
        const result = await deleteMessageService(messageID, userId)
        return res.status(200).json(result)
    }catch(error){
        next(error)
    }
}
export const RepromptController = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const {messageID, LLM, userMessage, user} = req.body
        const userId = req.user?.id
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized.' })
        }
        const result = await RepromptService({ messageID, LLM, userMessage, user, userId })
        return res.status(200).json(result)
    }catch(error){
        next(error)
    }
}
