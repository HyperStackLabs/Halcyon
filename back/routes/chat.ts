import express from 'express'
import { deleteMessage, getAChat, message, RepromptController } from '../controllers/chat.js'
import { validate } from '../utils/zod.js'
import { zodDeleteID, zodMessage } from '../schemas/zod/chatSchema.js'
import { verifyToken } from '../middleware/verifyToken.js'
export const chatRouter = express.Router()

chatRouter.get('/chat', verifyToken, getAChat)
chatRouter.post('/send-prompt', verifyToken, validate(zodMessage), message)
chatRouter.post('/reprompt-message', verifyToken, RepromptController)
chatRouter.delete('/chat', verifyToken, validate(zodDeleteID), deleteMessage)
