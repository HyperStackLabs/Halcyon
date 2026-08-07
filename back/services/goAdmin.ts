import { users } from "../models/models.js";

export async function goAdminService({id, role}: {id: string, role: 'user' | 'admin'}){
   try{
        const targetedUser = await users.findByIdAndUpdate(
            {_id: id}, 
            { role },
            {
                new: true,
                runValidators: true
            }
        )
        await targetedUser?.save()
    }catch(error){
        throw error
    }
}