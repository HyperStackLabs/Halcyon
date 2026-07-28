import { validate } from "../utils/zod.js";
import express from "express"
import { zodLogin, zodUser } from "../schemas/zod/authSchema.js";
import { login, signUp, verifyUser } from "../controllers/auth.js";
import { verifyToken } from "../middleware/middleware.js";
export const AuthRouter = express.Router()

AuthRouter.post('/sign-up', validate(zodUser), signUp)
AuthRouter.post('/log-in', validate(zodLogin), login)
AuthRouter.get('/verify-user', verifyToken, verifyUser)