import { UserError } from "../errors/userError.js";
import { users } from "../models/models.js";
import crypto from 'crypto'

export async function updateAPICredentials({id, apiKey, usageCap}: {id: string, apiKey: string, usageCap: number}){
    try{
        const foundUser = await users.findById({_id: id})
        if(!foundUser){
            throw new UserError('User not found', 404)
        }
        foundUser.API_KEY = crypto.hash('sha256', apiKey)
        foundUser.usageCap = usageCap
        await foundUser.save()
    }catch(error){
        throw error
    }
}