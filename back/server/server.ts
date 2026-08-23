import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { chatRouter } from '../routes/chat.js'
import { AuthRouter } from '../routes/auth.js'
import rateLimit from 'express-rate-limit'
import type { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import { userRouter } from '../routes/user.js'
import { AIRouter } from '../routes/ai_management.js'

export default function createServer(){
    const app = express()
    app.set('trust proxy', 1)
    const limiter = rateLimit({windowMs: 15 * 1000 * 60, limit: 700})
    app.use(helmet(), limiter, cookieParser())
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));
    app.use(express.json({limit: '1mb'}))
    app.use(AuthRouter, chatRouter, userRouter, AIRouter)
    app.use((err: any, _: Request, res: Response, next: NextFunction) => {
        console.log(err)
        if (res.headersSent) return next(err)
        return res.status(err.status || 500).json({message: String(err.message)})
    })
    return app
}