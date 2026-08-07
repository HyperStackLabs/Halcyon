import type { Request, Response, NextFunction } from "express";
import sendPrompt from "../services/activateChat.js";
import { conversation } from "../models/models.js";
import type { AuthRequest } from "../types/authTypes.js";
import { deleteMessageService } from "../services/deleteMessage.js";
import { RepromptService } from "../services/reprompt.js";
export const message = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const id = req?.user?.id
        const {userMessage, LLM, user} = req.body
        const sendMessage = await sendPrompt(userMessage, LLM, user, String(id))
        return res.status(200).json(sendMessage)
    }catch(error){
        next(error)
    }
}
export const getAChat = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const chats = await conversation.find({})
        return res.status(200).json(chats)
    }catch(error){
        next(error)
    }
}
export const deleteMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const {messageID} = req.body
        const result = await deleteMessageService(messageID)
        return res.status(204).json(result)
    }catch(error){
        next(error)
    }
}
export const RepromptController = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const {messageID} = req.body
        const result = await RepromptService(messageID)
        return res.status(200).json(result)
    }catch(error){
        next(error)
    }
}