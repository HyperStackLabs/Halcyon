import { models } from "../models/models.js";
export default async function RatingService({type, message, liked}){
    try{
        const usedModel = await models.findOne({codename: message.model})
        if(type == 'like' && usedModel?.likes){
            if(liked){
                liked = false
                usedModel.likes -= 1
                await usedModel.save()
            }
            liked = true
            usedModel.likes +=1
            await usedModel.save()
        }
    }catch(error){
        throw error
    }
}