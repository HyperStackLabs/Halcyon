import { chatError } from "../errors/chatError.js";
import { conversation } from "../models/models.js";

export async function deleteMessageService(messageID: string, userId: string){
    try{
        const updatedConversation = await conversation.findOneAndUpdate(
            { user: userId, 'messages._id': messageID },
            { $pull: { messages: { _id: messageID } } },
            { new: true },
        )
        if(!updatedConversation){
            throw new chatError('Failure to find the intended message', 404)
        }
        return updatedConversation
    }catch(error){
        throw error
    }
}
