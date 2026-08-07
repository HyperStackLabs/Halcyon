import type { ChatMessage } from "@heyputer/puter.js";
import { conversation } from "../models/models.js";
import { init } from "@heyputer/puter.js/src/init.cjs";
import { chatError } from "../errors/chatError.js";

export const RepromptService = async ({messageID, LLM, userMessage, user}: {messageID: string, LLM: string, userMessage: string, user: string})  => {
    try{
        const convo = await conversation.find({}).lean()
        const puter = init(process.env.PUTER_API_KEY)
        const initialMessage = await conversation.findById({_id: messageID})
        if(!initialMessage){
            throw new chatError('No message to rotate foun', 404)
        }
        const targetMessage = await conversation.findByIdAndDelete({_id: messageID})
        const messages: ChatMessage[] = [
            {role: 'system', content: `INSTRUCTION: You are a friendly helpful assistant powered by ${LLM} interacting ${user}. To make the text italic wrap the said test in *text*, to make it bolder to emphassize something wrap a part of the text in **text** but this is completely optional as it can only be used when highlighting text or in roleplay narratives`, images: []}
        ]
        const response = await puter.ai.chat(messages, {
            model: LLM
        })
        for(const document of convo){
            messages.push({
                    role: document.role,
                    content: String(document.content),
                    images: []
                })
            }
            const assistantMessage = new conversation({
                role: 'assistant',
                content: response.message?.content,
                model: LLM
            })
            messages.push({role: 'user', content: userMessage, images: []})
            await assistantMessage.save()
            return targetMessage
    }catch(error){
        throw error
    }
}