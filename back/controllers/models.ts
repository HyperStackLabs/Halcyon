import { models, users } from "../models/models.js";
import createNewAIAccess from "../services/createNewAI.js";
import type { AuthRequest } from "../types/authTypes.js";
import type { NextFunction, Response } from "express";

export const fetchAIModelDB = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const AILanguageModels = await models.find({})
        return res.status(200).json(AILanguageModels) 
    }catch(error){
        next(`${error} ERROR FETCHING AI MODELS FROM CONTROLLER`)
    }
}
export const addAIModel = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const {soft_name, codename, type, image} = req.body
        const addition = createNewAIAccess({soft_name, codename, type, image})
        return res.status(201).json(addition)
    }catch(error){
        next(`${error} ERROR CREATING NEW OBJECT CONTAINING AI INFO`)
    }
}
export const deleteAIModel = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const {_id} = req.body
        const userId = req.user?.id
        const user = await users.findById(userId)
        if(user?.role !== 'user'){
            return res.status(403).json({message: 'You aren`t an admin, therefore you`re not allowed to modify our database'})
        }
        const deletion = await models.findByIdAndDelete({_id})
        return res.status(204).json(deletion)
    }catch(error){
        next(`${error} ERROR DELETING AN AI MODEL FROM CONTROLLER`)
    }
}