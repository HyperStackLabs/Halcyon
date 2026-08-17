import { banlands, conversation, users } from "../models/models.js";
import changePassword from "../services/changePassword.js";
import changeProfile from "../services/changeProfile.js";
import { deleteAccountService } from "../services/deleteUser.js";
import { goAdminService } from "../services/goAdmin.js";
import { updateAPICredentials } from "../services/updateAPI.js";
import type { AuthRequest } from "../types/authTypes.js";
import type { Response, NextFunction } from "express";

export const getUsersDB = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const locatedUserCollection = await users.find({}).select('-password').lean()
        return res.status(200).json(locatedUserCollection)
    }catch(error){
        next(error)
    }
}
export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const {id, ban} = req.body
    const targetedUser = await users.findById(id)
    try{
        if(ban){
            const banAdmission = new banlands({
                userName: targetedUser?.userName
            })
            const deletion = await users.deleteOne({_id: id})
            await banAdmission.save()
            res.status(204).json({deletion, message: {message: 'Successfully banned.'}})
        }
        const deletion = await users.deleteOne({_id: id})
        return res.status(204).json({deletion, message: {message: 'Successfully banned.'}})
    }catch(error){
        next(error)
    }
}
export const updateUserController = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const id = req?.user?.id
        const {profile} = req.body
        const resultsOfEditing = await changeProfile({id: String(id), profilePicture: profile.profilePicture, userName: profile.userName, email: profile.email, displayName: profile.displayName})
        return res.status(200).json(resultsOfEditing)
    }catch(error){
        next(error)
    }
}
export const updatePasswordController = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const id = req.user?.id
        const {currentPassword, newPassword} = req.body
        console.log(id)
        const resultsOfEditing = await changePassword({id: String(id), currentPassword, newPassword})
        return res.status(200).json(resultsOfEditing)
    }catch(error){
        next(error)
    }
}
export const UserAPIController = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const id = req.user?.id as string
        const {apiKey, usageCap} = req.body
        const result = await updateAPICredentials({id, apiKey, usageCap})
        return res.status(200).json(result)
    }catch(error){
        next(error)
    }
}
export const adminPromoController = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const id = req.user?.id as string
        const {role} = req.body
        const promotionResult = await goAdminService({id, role})
        return res.status(200).json(promotionResult)
    }catch(error){
        next(error)
    }
}
export const deleteAccountController = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const id = req.user?.id as string
        const deletion = await deleteAccountService({id})
        return res.status(204).json(deletion)
    }catch(error){
        next(error)
        return res.status(500).json({message: 'Something went wrong.'})
    }
}
export const getConversationNames = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const ID = req.user?.id
        if(!ID){
            return res.status(403).json({message: "Unauthorized so therefore forbidden"})
        }
        const conversations = await conversation.find({user: ID}).select('title _id').sort({
            createdAt: -1
        })
        return res.status(200).json(conversations)
    }catch(error){
        next(error)
    }
}