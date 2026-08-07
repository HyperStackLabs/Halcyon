import { validate } from "../utils/zod.js";
import express from 'express'
import { verifyToken } from "../middleware/verifyToken.js";
import { addAIModel, deleteAIModel, fetchAIModelDB } from "../controllers/models.js";
import { zodAIObject } from "../schemas/zod/modelSchema.js";
import { verifyAdministrator } from "../middleware/verifyAdmin.js";
export const AIRouter = express.Router()

AIRouter.get('/ai-models', fetchAIModelDB)
AIRouter.delete('/ai-models', verifyToken, verifyAdministrator, deleteAIModel)
AIRouter.post('/ai-models', verifyToken, verifyAdministrator, validate(zodAIObject), addAIModel)
