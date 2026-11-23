import { models } from "../models/models.js"

export default async function interactionHandler(model: string){
    try{
        const targetedModel = await models.findOne({codename: model})
        if(targetedModel){
            targetedModel.interactions += 1
            await targetedModel.save()
        }
    }catch(error){
        throw error
    }
}