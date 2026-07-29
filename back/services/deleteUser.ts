import { users } from "../models/models.js"

export async function deleteAccountService({id}: {id: string}){
    try{
        const target = await users.findByIdAndDelete({_id: id})
        return target
    }catch(error){
        console.log(error)
    }
}