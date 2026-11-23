import {init} from '@heyputer/puter.js/src/init.cjs'
import { conversation, models, users } from '../models/models.js'
import type { ChatMessage } from '@heyputer/puter.js'
import { chatError } from '../errors/chatError.js'
import mongoose from 'mongoose'
import deleteAI from './deleteAIModel.js'
import interactionHandler from './interactionHandler.js'

export default async function sendPrompt(userMessage: string, convoId: string | undefined, LLM: string, user: string | undefined, id: string, provider: string){
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

        const puter = init(process.env.PUTER_API_KEY) // puter doesnt support BYOK
        const messages: ChatMessage[] = [
            {role: 'system', content: `INSTRUCTION: You are a friendly helpful assistant powered by ${LLM}, please do not be repetitive. To make the text italic wrap the said test in *text*, to make it bolder to emphassize something wrap a part of the text in **text** but this is completely optional as it can only be used when highlighting text or in roleplay narratives, additionally when making Additionally when intending to give a link, you can wrap the link in a <a>text</a> format to give a link. additionally if in a previous message you get called a different ai, it islikey that the user was using that ai and switched`, images: []}
        ]

        for(const document of chat?.messages ?? []){
            messages.push({
                role: document.role as 'user' | 'assistant' | 'system',
                content: String(document.content),
                images: []
            })
        }
        messages.push({role: 'user', content: userMessage, images: []})
        const response = await puter.ai.chat(messages, { model: LLM, provider: provider })
        const createdAt = new Date()
        const totalTokens = response?.usage?.prompt_tokens + response?.usage?.completion_tokens
        if (chat) {
            chat.totalTokens = (chat.totalTokens ?? 0) + totalTokens
            chat.totalTokens += totalTokens
        }
        const newMessages = [
            { user: user ?? foundUser.name, role: 'user', content: userMessage, createdAt },
            { role: 'assistant', content: response.message?.content ?? '', model: LLM, createdAt: new Date() },
        ]
        if (chat) {
            chat.messages.push(...newMessages)
            await chat.save()
        } else {
            chat = await conversation.create({ title: userMessage, user: id, messages: newMessages, totalTokens })
        }
        interactionHandler(LLM)
        return { convoId: chat._id.toString(), messages: chat.messages }
    }catch(error: any){
        if(error.error === `Model not found: ${LLM}`){
            const falseModel = await models.findOne({codename: LLM}).select('_id codename')
            console.log(`removed model: ${falseModel?.codename}`)
            if(falseModel){
                deleteAI({_id: falseModel?._id.toString()})
            }
        }
        throw error
    }
}
