import express from 'express'
import { validate } from '../utils/zod.js'
import { deleteUser, getUsersDB, updatePasswordController, updateUserController } from '../controllers/users.js'
import { verifyToken } from '../middleware/middleware.js'
export const userRouter = express.Router()

userRouter.post('/users', verifyToken, getUsersDB)
userRouter.delete('/delete-user', verifyToken, deleteUser)
userRouter.patch('/change-profile', verifyToken, updateUserController)
userRouter.patch('/change-password', verifyToken, updatePasswordController)