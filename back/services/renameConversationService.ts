import { conversation } from "../models/models.js"

export default async function renameConversationService({newTitle, _id}: {newTitle: string, _id: string}){
    try{
        const targetedConversation = await conversation.findById({_id})
        if(targetedConversation?.title == newTitle) return
        if(targetedConversation?.title){
            targetedConversation.title = newTitle
        }
        await targetedConversation?.save()
        return targetedConversation
    }catch(error){
        console.log(error)
        throw error
    }
}