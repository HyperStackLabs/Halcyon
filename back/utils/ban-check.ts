import { banlands } from "../models/models.js";

export async function checkForBannedUsers(userName: string){
    const bannedBefore = await banlands.findOne({userName})
    if(bannedBefore){
        return true
    }
    return false
}