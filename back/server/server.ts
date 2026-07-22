import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { router } from '../app.js'
import rateLimit from 'express-rate-limit'
import type { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'

export default function createServer(){
    const app = express()
    app.set('trust proxy', 1)
    const limiter = rateLimit({windowMs: 15 * 1000 * 60, limit: 700})
    app.use(helmet())
    app.use(limiter)
    app.use(cookieParser())
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));
    app.use(express.json({limit: '1mb'}))
    app.use(router)
    app.use((err: any, _: Request, res: Response, next: NextFunction) => {
        console.log(err)
        if (res.headersSent) return next(err)
        return res.status(err.status || 500).json({message: err.message || "There's a problem here..."})
    })
    return app
}