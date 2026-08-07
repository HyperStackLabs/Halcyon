import express from 'express'
import { deleteMessage, getAChat, message } from '../controllers/chat.js'
import { validate } from '../utils/zod.js'
import { zodDeleteID, zodMessage } from '../schemas/zod/chatSchema.js'
import { verifyToken } from '../middleware/verifyToken.js'
export const chatRouter = express.Router()

chatRouter.get('/chat', verifyToken, getAChat)
chatRouter.post('/chat', verifyToken, validate(zodMessage), message)
chatRouter.delete('/chat', verifyToken, validate(zodDeleteID), deleteMessage)