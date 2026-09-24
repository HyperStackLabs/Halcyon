import { chatError } from "../errors/chatError.js";
import { conversation } from "../models/models.js";

export async function deleteMessageService(messageID: string, userId: string){
    try{
        const updatedConversation = await conversation.findOne({
            user: userId,
            'messages._id': messageID
        })
        if(!updatedConversation){
            throw new chatError('Failure to find the intended message', 404)
        }
        const index = updatedConversation.messages.findIndex(message => message._id.toString() === messageID)
        const targetedMessage = updatedConversation?.messages[index]?._id
        const previousMessage = index > 0 && updatedConversation?.messages[index -  1]?._id
        
        await updatedConversation.updateOne(
            {$pull: {
                messages: {
                    _id:{
                        $in: previousMessage ? [targetedMessage, previousMessage] : [targetedMessage]
                    }
                }
            }}
        )
        return updatedConversation
    }catch(error){
        throw error
    }
}
