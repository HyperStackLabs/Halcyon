import { models, users } from "../models/models.js";
import createNewAIAccess from "../services/createNewAI.js";
import type { AuthRequest } from "../types/authTypes.js";
import type { NextFunction, Response } from "express";

export const fetchAIModelDB = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const AILanguageModels = await models.find({}).lean()
        return res.status(200).json(AILanguageModels) 
    }catch(error){
        next(error)
    }
}
export const addAIModel = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const {soft_name, codename, type, image} = req.body
        const addition = await createNewAIAccess({soft_name, codename, type, image})
        return res.status(201).json(addition)
    }catch(error){
        next(error)
    }
}
export const deleteAIModel = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const {_id} = req.body
        const deletion = await models.findByIdAndDelete({_id})
        return res.status(204).json(deletion)
    }catch(error){
        next(error)
    }
}