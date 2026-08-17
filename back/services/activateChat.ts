import {init} from '@heyputer/puter.js/src/init.cjs'
import { conversation, users } from '../models/models.js'
import type { ChatMessage } from '@heyputer/puter.js'
import { chatError } from '../errors/chatError.js'
import mongoose from 'mongoose'

export default async function sendPrompt(userMessage: string, convoId: string | undefined, LLM: string, user: string | undefined, id: string){
    try{
        const foundUser = await users.findById({_id: id}).select('-password')
        if(!foundUser?.API_KEY){
            throw new chatError('No API Key detected, therefore unauthorized.', 403)
        }

        let chat = null
        if (convoId) {
            if (!mongoose.isValidObjectId(convoId)) {
                throw new chatError('Invalid conversation ID.', 400)
            }
            chat = await conversation.findOne({ _id: convoId, user: id })
            if (!chat) {
                throw new chatError('Conversation not found.', 404)
            }
        }

        const puter = init(process.env.PUTER_API_KEY)
        const monthlyAllowance = (await puter.auth.getMonthlyUsage()).allowanceInfo.remaining
        if(monthlyAllowance <= 0.005){
            throw new chatError('You ran out of monthly quota, get a new API key or wait for a month', 403)
        }
        const messages: ChatMessage[] = [
            {role: 'system', content: `INSTRUCTION: You are a friendly helpful assistant powered by ${LLM} interacting ${user ?? foundUser.name}. To make the text italic wrap the said test in *text*, to make it bolder to emphassize something wrap a part of the text in **text** but this is completely optional as it can only be used when highlighting text or in roleplay narratives`, images: []}
        ]

        for(const document of chat?.messages ?? []){
            messages.push({
                role: document.role as 'user' | 'assistant' | 'system',
                content: String(document.content),
                images: []
            })
        }

        messages.push({role: 'user', content: userMessage, images: []})
        const response = await puter.ai.chat(messages, { model: LLM })
        const createdAt = new Date()
        const newMessages = [
            { user: user ?? foundUser.name, role: 'user', content: userMessage, createdAt },
            { role: 'assistant', content: response.message?.content ?? '', model: LLM, createdAt: new Date() },
        ]

        if (chat) {
            chat.messages.push(...newMessages)
            await chat.save()
        } else {
            chat = await conversation.create({ title: userMessage, user: id, messages: newMessages })
        }

        return { convoId: chat._id.toString(), messages: chat.messages }
    }catch(error){
        throw error
    }
}
