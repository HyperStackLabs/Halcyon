import bcrypt from 'bcrypt'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { InferLogin, User } from '../types/authTypes.js'
import { users } from '../models/models.js'
import { AuthError } from '../errors/authError.js'

export async function loginToAccount({email, password}: InferLogin){
    const target = await users.findOne({email})
    const isPasswordCorrect = await bcrypt.compare(password, target?.password as string)
    if (!target) {
        throw new AuthError('Incorrect email or password.')
    }
    if(!isPasswordCorrect){
        throw new AuthError('Incorrect password. Try again.')
    }
    if(!process.env.JWT_SECRET){
        throw new AuthError('JWT_SECRET MISSING', 500)
    }
    const token = jwt.sign({id: target._id.toString()} satisfies JwtPayload, process.env.JWT_SECRET, {
        expiresIn: '24h'
    })
    return {
        user: {
            userName: target.userName,
            name: target.name,
            email: target.email,
            role: target.role,
            profilePicture: target.profilePicture
        },
        token
    }
}