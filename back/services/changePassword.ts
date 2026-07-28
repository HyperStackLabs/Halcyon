import bcrypt from 'bcrypt'
import { UserError } from "../errors/userError.js";
import { users } from "../models/models.js";

export default async function changePassword({id, currentPassword, newPassword}: {id: string, currentPassword: string, newPassword: string}){
    try{
        const targetedUser = await users.findById(id)
        if(!targetedUser){
            throw new UserError('User not found to update')
        }
        const isCorrect = await bcrypt.compare(currentPassword, targetedUser.password)
        if(!isCorrect){
            throw new UserError('Current password is incorrect', 401)
        }
        targetedUser.password = await bcrypt.hash(newPassword, 10)
        await targetedUser.save()
        return { message: 'Password updated successfully' }
    }catch(error){
        console.log(error)
        throw error
    }
}