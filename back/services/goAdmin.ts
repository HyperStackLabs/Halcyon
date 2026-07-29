import { users } from "../models/models.js";

export async function goAdminService({id, role, rateLimit}: {id: string, role: 'user' | 'admin', rateLimit: number}){
   try{
        const targetedUser = await users.findByIdAndUpdate(
            {id}, 
            { role, rateLimit },
            {
                new: true,
                runValidators: true
            }
        )
        await targetedUser?.save()
    }catch(error){
        console.log(error)
    }
}