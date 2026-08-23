import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import { users } from "../models/models.js";
import type { User } from "../types/authTypes.js";
import { AuthError } from "../errors/authError.js";
import { checkForBannedUsers } from "../utils/ban-check.js";

export default async function createUser({name, userName, password, email}: User){
    try{
        const anotherUser = await users.findOne({
            $or: [
                {email: email},
                {name: name}
            ]
        })
        const isBanned = await checkForBannedUsers(userName)
        if(isBanned){
            throw new AuthError('Service Error: This user is terminated', 403)
        }
        if(anotherUser){
            throw new AuthError('Service Error: Theres already another user registered.', 409)
        }
        const newUser = new users({
            name,
            userName,
            email,
            password: await bcrypt.hash(password, 10),
            profilePicture: '',
            role: 'user',
            API_KEY: undefined,
            usageCap: 0.25
        })
        await newUser.save()
    }catch(error){
        throw error
    }
}