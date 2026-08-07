import { validate } from "../utils/zod.js";
import express from "express"
import { zodLogin, zodUser } from "../schemas/zod/authSchema.js";
import { login, SignOut, signUp, verifyUser } from "../controllers/auth.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { logInLimiter, RegistrationLimiter } from "../utils/rate-limiters.js";
export const AuthRouter = express.Router()

AuthRouter.post('/sign-up', validate(zodUser), RegistrationLimiter, signUp)
AuthRouter.post('/log-in', validate(zodLogin), logInLimiter, login)
AuthRouter.get('/verify-user', verifyToken, verifyUser)
AuthRouter.post('/sign-out', verifyToken, SignOut)