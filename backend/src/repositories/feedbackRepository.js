import { Feedback } from '../models/index.js'

// Feedback repository isolates review persistence and lookup operations.
export const countFeedback = () => Feedback.estimatedDocumentCount()

export const listFeedback = (filter = {}, limit) => {
  const query = Feedback.find(filter)
  const parsedLimit = Number(limit)

  if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
    query.limit(parsedLimit)
  }

  return query.lean()
}

export const findFeedbackByBookingId = (bookingId) => Feedback.findOne({ bookingId }).lean()

export const upsertFeedbackById = (feedback) => Feedback.findOneAndUpdate(
  { id: feedback.id },
  { $set: feedback },
  { upsert: true, new: true, runValidators: true, context: 'query' }
).lean()