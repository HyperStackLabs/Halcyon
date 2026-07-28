import { users } from "../models/models.js";
import createUser from "../services/createUser.js";
import { loginToAccount } from "../services/loginToAccount.js";
import type { AuthRequest } from "../types/authTypes.js";
import type { Response, NextFunction } from "express";

export const verifyUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const userId = req?.user?.id
        if(!userId){
            return res.status(401).json({message: 'You are unauthorized.'})
        }
        const target = await users.findById(userId).select('-password')
        return res.status(200).json(target)
    }catch(error){
        next(`${error} - ERROR FROM USER VERIFY CONTROLLER`)
    }
}
export const signUp = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const {name, userName, password, email} = req.body
        const signUpResult = await createUser({name, userName, password, email})
        res.status(201).json(signUpResult)
    }catch(error){
        next(`${error} - ERROR FROM SIGN UP CONTROLLER`)
    }
}
export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const {email, password, rememberMe} = req.body
        const {token, user} = await loginToAccount({email, password, rememberMe})
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 1000,
            sameSite: 'none'
        })
        return res.status(200).json(user)
    }catch(error){
        next(`${error} - ERROR FROM LOGIN CONTROLLER`)
    }
}
export const SignOut = async (_: AuthRequest, res: Response, next: NextFunction) => {
    try{
        res.clearCookie('token', {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        })
        res.status(200).json({message: 'Signed out successfully'})
    }catch(error){
        console.log(error)
        next(`${error} - ERROR FROM SIGN-OUT`)
    }
}