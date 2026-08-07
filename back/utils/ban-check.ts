import { banlands } from "../models/models.js";

export async function checkForBannedUsers(userName: string){
    const bannedBefore = await banlands.findOne({userName}).select('userName')
    if(bannedBefore){
        return true
    }
    return false
}