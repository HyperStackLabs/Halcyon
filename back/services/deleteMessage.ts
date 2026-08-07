import { chatError } from "../errors/chatError.js";
import { conversation } from "../models/models.js";

export async function deleteMessageService(messageID: string){
    try{
        const targetMessage = await conversation.findByIdAndDelete({_id: messageID})
        if(!targetMessage){
            throw new chatError('Failure to find the intended message', 404)
        }
        return targetMessage
    }catch(error){
        throw error
    }
}