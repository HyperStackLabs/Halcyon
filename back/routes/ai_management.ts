import { validate } from "../utils/zod.js";
import express from 'express'
import { verifyToken } from "../middleware/middleware.js";
import { addAIModel, deleteAIModel, fetchAIModelDB } from "../controllers/models.js";
export const AIRouter = express.Router()

AIRouter.get('/ai-models', fetchAIModelDB)
AIRouter.delete('/ai-models', verifyToken, deleteAIModel)
AIRouter.post('/ai-models', verifyToken, addAIModel)
