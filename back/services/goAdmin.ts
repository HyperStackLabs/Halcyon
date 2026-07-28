import { users } from "../models/models.js";

export async function goAdminService({id, role, rateLimit}: {id: string, role: 'user' | 'admin', rateLimit: number}){
   try{
        const targetedUser = await users.findByIdAndUpdate(
            {_id: id}, 
            { role, rateLimit },
            {
                new: true,
                runValidators: true
            }
        ).select('-password')
        await targetedUser?.save()
    }catch(error){
        console.log(error)
    }
}