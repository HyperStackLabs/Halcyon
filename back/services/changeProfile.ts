import { UserError } from "../errors/userError.js";
import { users } from "../models/models.js";
 
export default async function changeProfile({id, profilePicture, userName, email, displayName}: {id: string, profilePicture: string, userName: string, email: string, displayName: string}){
    try{
        const targetedUser = await users.
        findByIdAndUpdate(
            id, 
            {userName, email, name: displayName, profilePicture},
            {
                new: true,
                runValidators: true
            }
        )
        if(!targetedUser){
            throw new UserError('User not found to update')
        }
    }catch(error){
        console.log(error)
        throw error
    }
}