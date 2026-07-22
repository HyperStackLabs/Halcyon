import express from 'express'
import { getAChat, message } from './controllers/chat.js'
import { validate } from './utils/zod.js'
import { zodMessage } from './schemas/zod/chatSchema.js'
export const router = express.Router()

router.get('/chat', getAChat)
router.post('/chat', validate(zodMessage), message)