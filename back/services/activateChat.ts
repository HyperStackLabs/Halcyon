import {init} from '@heyputer/puter.js/src/init.cjs'
import { conversation } from '../models/models.js'
import type { ChatMessage } from '@heyputer/puter.js'

export default async function sendPrompt(userMessage: string, LLM: string){
    try{
        const conversationArray = await conversation.find().lean()
        const puter = init(process.env.PUTER_API_KEY)
        const messages: ChatMessage[] = [
            {role: 'system', content: `INSTRUCTION: You are a friendly helpful assistant. To make the text italic wrap the said test in *text*, to make it bolder to emphassize something wrap a part of the text in **text** but this is completely optional as it can only be used when highlighting text or in roleplay narratives`, images: []}
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
                        role: 'user',
                        content: userMessage
                    },
                    {
                        role: 'assistant',
                        content: response.message?.content,
                        model: LLM
                    }
                ]
            })
            await newMessage.save()
    }catch(error){
        console.log(error)
    }
}