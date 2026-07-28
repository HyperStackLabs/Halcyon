import type { Request, Response, NextFunction } from "express";
import sendPrompt from "../services/activateChat.js";
import { conversation } from "../models/models.js";
export const message = (req: Request, res: Response, next: NextFunction) => {
    try{
        const {userMessage, LLM, user} = req.body
        const sendMessage = sendPrompt(userMessage, LLM, user)
        return res.status(200).json(sendMessage)
    }catch(error){
        console.log(error)
        next()
    }
}
export const getAChat = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const chats = await conversation.aggregate([
            {$unwind: `$messages`},
            {
                $group: {
                _id: `$messages._id`,
                role: { $first: `$messages.role` },
                content: { $first: `$messages.content` },
                createdAt: { $first: `$messages.createdAt` },
                model: { $first: `$messages.model` }
                }
            },
            { 
                $sort: { 
                    parsedDate: 1, 
                    _id: 1 
                } 
            },
            {
                $project: {
                    parsedDate: 0
                }
            }
        ])
        return res.status(200).json(chats)
    }catch(error){
        console.log(error)
        next()
    }
}