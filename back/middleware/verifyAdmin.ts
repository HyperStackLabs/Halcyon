import { users } from "../models/models.js";
import type { AuthRequest } from "../types/authTypes.js";
import type { Response, NextFunction } from "express";

export const verifyAdministrator = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try{
        const id = req.user?.id
        if(!id){
            return res.status(401).json({message: 'Unauthorized.'})
        }
        const User = await users.findById({_id: id}).select('role')
        if(User?.role !== 'admin'){
            return res.status(403).json({message: 'Admin access required'})
        }
        next()
    }catch(error){
        next(error)
    }
}