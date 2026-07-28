import express from 'express'
import { getAChat, message } from '../controllers/chat.js'
import { validate } from '../utils/zod.js'
import { zodMessage } from '../schemas/zod/chatSchema.js'
import { verifyToken } from '../middleware/middleware.js'
export const chatRouter = express.Router()

chatRouter.get('/chat', verifyToken, getAChat)
chatRouter.post('/chat', verifyToken, validate(zodMessage), message)