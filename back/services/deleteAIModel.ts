import { models } from "../models/models.js"
export default async function deleteAI({_id}: {_id: string}) {
    try{
        const deletion = await models.findByIdAndDelete({_id})
        return deletion
    }catch(error){
        throw error
    }
}