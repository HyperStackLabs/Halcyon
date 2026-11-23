import { UserError } from "../errors/userError.js"
import { conversation } from "../models/models.js"

export async function deleteConvo(_id: string, state: boolean){
    try{
        const targetedData = await conversation.findByIdAndDelete({_id})
        return targetedData
    }catch(error){
        throw error
    }
}