import { UserError } from "../errors/userError.js"
import { conversation } from "../models/models.js"

export async function lockConversationService({id}: {id: string}){
    try{
        const targetedConversation = await conversation.findByIdAndUpdate(id)
        if(!targetedConversation){
            throw new UserError('Conversation not found')
        }
        targetedConversation.locked = !targetedConversation.locked
        await targetedConversation.save()
    }catch(error){
        throw error
    }
}