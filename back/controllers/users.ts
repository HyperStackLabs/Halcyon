import { banlands, users } from "../models/models.js";
import changePassword from "../services/changePassword.js";
import changeProfile from "../services/changeProfile.js";
import { goAdminService } from "../services/goAdmin.js";
import { updateAPICredentials } from "../services/updateAPI.js";
import type { AuthRequest } from "../types/authTypes.js";
import type { Response, NextFunction } from "express";

export const getUsersDB = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const locatedUserCollection = await users.find({}).select('-password').lean()
        return res.status(200).json(locatedUserCollection)
    }catch(error){
        console.log(error)
        next(`${error} ERROR ATTEMPTING TO FETCH USERS`)
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
        res.status(204).json({deletion, message: {message: 'Successfully banned.'}})
    }catch(error){
        console.log(error, targetedUser)
        next(`${error} ERROR DELETING THE USER FROM CONTROLLER`)
    }
}
export const updateUserController = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const id = req?.user?.id
        const {profile} = req.body
        const resultsOfEditing = await changeProfile({id: String(id), profilePicture: profile.profilePicture, userName: profile.userName, email: profile.email, displayName: profile.displayName})
        return res.status(200).json(resultsOfEditing)
    }catch(error){
        next(`${error} ERROR UPDATING THE USER FROM CONTROLLER`)
        return res.status(500).json({message: 'Something went wrong'})
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
        next(`${error} ERROR UPDATING PASSWORD FROM CONTROLLER`)
        return res.status(500).json({message: 'Something went wrong'})
    }
}
export const UserAPIController = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const id = req.user?.id
        const {apiKey, usageCap} = req.body
        const result = await updateAPICredentials({id, apiKey, usageCap})
        return res.status(200).json(result)
    }catch(error){
        next(`${error} ERROR UPDATING API CREDENTIALS`)
        return res.status(500).json({message: 'Something went wrong'})
    }
}
export const adminPromoController = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const id = req.user?.id
        const {role, rateLimit} = req.body
        const promotionResult = await goAdminService({id, role, rateLimit})
        return res.status(200).json(promotionResult)
    }catch(error){
        next(`${error} ERROR PROMOTING TO ADMIN`)
        return res.status(500).json({message: 'Something went wrong'})
    }
}