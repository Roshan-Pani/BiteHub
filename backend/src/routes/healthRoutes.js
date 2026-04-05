import express from 'express'
import { getHealth } from '../controllers/healthController.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'

// Health routes keep the top-level readiness endpoint isolated.
export const healthRouter = express.Router()

healthRouter.get('/health', asyncHandler(getHealth))