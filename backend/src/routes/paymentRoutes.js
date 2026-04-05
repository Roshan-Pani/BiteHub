import express from 'express'
import { listPayments, upsertPayment } from '../controllers/paymentController.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { requireBodyFields } from '../middlewares/validateRequest.js'

// Payment routes remain small and delegate persistence to services.
export const paymentRouter = express.Router()

paymentRouter.get('/payments', asyncHandler(listPayments))
paymentRouter.post('/payments', requireBodyFields(['id']), asyncHandler(upsertPayment))