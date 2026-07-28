import {init} from '@heyputer/puter.js/src/init.cjs'
import { conversation, users } from '../models/models.js'
import type { ChatMessage } from '@heyputer/puter.js'
import { chatError } from '../errors/chatError.js'

export default async function sendPrompt(userMessage: string, LLM: string, user: string, id: string){
    try{
        const foundUser = await users.findById({_id: id}).select('-password')
        if(!foundUser?.API_KEY){
            throw new chatError('No API Key detected, therefore unauthorized.', 403)
        }
        const conversationArray = await conversation.find().lean()
        const puter = init(process.env.PUTER_API_KEY)
        const monthlyAllowance = (await puter.auth.getMonthlyUsage()).allowanceInfo.remaining
        if(monthlyAllowance <= 0.005){
            throw new chatError('You ran out of monthly quota, get a new API key or wait for a month', 403)
        }
        const messages: ChatMessage[] = [
            {role: 'system', content: `INSTRUCTION: You are a friendly helpful assistant powered by ${LLM} interacting ${user}. To make the text italic wrap the said test in *text*, to make it bolder to emphassize something wrap a part of the text in **text** but this is completely optional as it can only be used when highlighting text or in roleplay narratives`, images: []}
        ]
        for(const document of conversationArray){
            if(document.messages){
                for(const message of document.messages){
                    messages.push({
                        role: message.role,
                        content: String(message.content),
                        images: []
                    })
                }
            }
        }
        messages.push({role: 'user', content: userMessage, images: []})
        const response = await puter.ai.chat(messages, {
            model: LLM
        })
            const newMessage = new conversation({
                    messages: [
                    {
                        user,
                        role: 'user',
                        content: userMessage
                    },
                    {
                        role: 'assistant',
                        content: response.message?.content,
                        model: LLM
                    }
                ]}
            )
            await newMessage.save()
    }catch(error){
        console.log(error)
    }
}