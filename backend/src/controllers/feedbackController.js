import {
  buildRestaurantFeedbackStats,
  getFeedbackEligibility,
  getFeedbackList,
  submitFeedbackForBooking,
  upsertFeedbackRecord
} from '../services/feedbackService.js'
import { sendServiceResult } from '../utils/serviceResult.js'

// Feedback controller remains thin and keeps review transport concerns separate.
export const listFeedback = async (req, res) => {
  const feedback = await getFeedbackList(req.query)
  return res.json(feedback)
}

export const getFeedbackEligibilityController = async (req, res) => {
  const { userId = '' } = req.query
  const gate = await getFeedbackEligibility({ bookingId: req.params.bookingId, userId })
  return res.json(gate)
}

export const submitFeedback = async (req, res) => {
  const result = await submitFeedbackForBooking(req.body || {})
  return sendServiceResult(res, result)
}

export const upsertFeedback = async (req, res) => {
  const result = await upsertFeedbackRecord(req.body || {})
  return sendServiceResult(res, result)
}

export const getRestaurantFeedbackStatsController = async (req, res) => {
  const stats = await buildRestaurantFeedbackStats(req.params.id)
  return res.json(stats)
}