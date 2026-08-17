import type { ChatMessage } from "@heyputer/puter.js";
import { conversation } from "../models/models.js";
import { init } from "@heyputer/puter.js/src/init.cjs";
import { chatError } from "../errors/chatError.js";

export const RepromptService = async ({
    messageID,
    LLM,
    userMessage,
    user,
    userId,
}: {
    messageID: string,
    LLM: string,
    userMessage: string,
    user: string,
    userId: string,
})  => {
    try{
        const convo = await conversation.findOne({ user: userId, 'messages._id': messageID })
        if(!convo){
            throw new chatError('No message to regenerate found.', 404)
        }

        const targetIndex = convo.messages.findIndex((message) => message._id.toString() === messageID)
        if (targetIndex === -1) {
            throw new chatError('No message to regenerate found.', 404)
        }

        const puter = init(process.env.PUTER_API_KEY)
        const messages: ChatMessage[] = [
            {role: 'system', content: `INSTRUCTION: You are a friendly helpful assistant powered by ${LLM} interacting ${user}. To make the text italic wrap the said test in *text*, to make it bolder to emphassize something wrap a part of the text in **text** but this is completely optional as it can only be used when highlighting text or in roleplay narratives`, images: []}
        ]

        for(const document of convo.messages.slice(0, targetIndex)){
            messages.push({
                role: document.role as 'user' | 'assistant' | 'system',
                content: String(document.content),
                images: []
            })
        }

        if (userMessage) {
            messages.push({role: 'user', content: userMessage, images: []})
        }

        const response = await puter.ai.chat(messages, { model: LLM })
        convo.messages.splice(targetIndex, 1, {
            role: 'assistant',
            content: response.message?.content ?? '',
            model: LLM,
            createdAt: new Date(),
        })
        await convo.save()
        return convo
    }catch(error){
        throw error
    }
}
