import express from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { requireBodyFields } from '../middlewares/validateRequest.js'
import {
  getFeedbackEligibilityController,
  listFeedback,
  submitFeedback,
  upsertFeedback
} from '../controllers/feedbackController.js'

// Feedback routes stay focused on review retrieval and submission.
export const feedbackRouter = express.Router()

feedbackRouter.get('/feedback', asyncHandler(listFeedback))
feedbackRouter.get('/feedback/eligibility/:bookingId', asyncHandler(getFeedbackEligibilityController))
feedbackRouter.post('/feedback/submit', requireBodyFields(['bookingId', 'userId', 'restaurantId', 'rating']), asyncHandler(submitFeedback))
feedbackRouter.post('/feedback', requireBodyFields(['id']), asyncHandler(upsertFeedback))