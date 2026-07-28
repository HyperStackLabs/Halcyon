import { models } from "../models/models.js";
import type { LanguageModel } from "../types/modelTypes.js";

export default async function createNewAIAccess({soft_name, codename, image, type}: LanguageModel){
    try{
        const addedLanguageModel = new models({
            soft_name,
            codename,
            image,
            type
        })
        await addedLanguageModel.save()
    }catch(error){
        console.log(error)
    }
}