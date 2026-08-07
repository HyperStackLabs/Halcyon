import { AdminError } from "../errors/adminError.js";
import { models } from "../models/models.js";
import type { LanguageModel } from "../types/modelTypes.js";

export default async function createNewAIAccess({soft_name, codename, image, type}: LanguageModel){
    try{
        const ModelExists = await models.findOne({codename})
        if(ModelExists){
            throw new AdminError('This model already exists.', 409)
        }
        const addedLanguageModel = new models({
            soft_name,
            codename,
            image,
            type
        })
        await addedLanguageModel.save()
    }catch(error){
        throw error
    }
}