import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import type { AuthRequest, AuthTokenPayload } from '../types/authTypes.js';

export const verifyToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({message: "Unauthorized."})
    }
    if(!process.env.JWT_SECRET){
        return res.status(500).json({message: "The JWT_Secret is missing."})
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as AuthTokenPayload
        req.user = decoded as AuthRequest['user']
        next()
    }catch(error){
        next(error)   
    }
}