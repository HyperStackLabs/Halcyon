import express from 'express'
import { validate } from '../utils/zod.js'
import { adminPromoController, deleteAccuntController, deleteUser, getUsersDB, updatePasswordController, updateUserController, UserAPIController } from '../controllers/users.js'
import { verifyToken } from '../middleware/middleware.js'
import { zodAPICreds } from '../schemas/zod/api-creds.js'
import { zodPasswordChange, zodProfileChange } from '../schemas/zod/userManagement.js'
export const userRouter = express.Router()

userRouter.post('/users', verifyToken, getUsersDB)
userRouter.delete('/delete-user', verifyToken, deleteUser)
userRouter.patch('/change-profile', verifyToken, validate(zodProfileChange), updateUserController)
userRouter.patch('/change-password', verifyToken, validate(zodPasswordChange), updatePasswordController)
userRouter.patch('/api-changes', verifyToken, validate(zodAPICreds), UserAPIController)
userRouter.patch('/go-admin', verifyToken, adminPromoController)
userRouter.delete('/delete-account', verifyToken, deleteAccuntController)