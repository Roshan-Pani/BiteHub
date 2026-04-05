import {
  evaluateFeedbackGate
} from '../../../shared/bookingRules.js'
import {
  findBookingById,
  updateBookingById
} from '../repositories/bookingRepository.js'
import { buildFeedbackLinkedBookingPatch } from '../hooks/bookingLifecycleHooks.js'
import {
  findFeedbackByBookingId,
  listFeedback,
  upsertFeedbackById
} from '../repositories/feedbackRepository.js'
import { listUsers } from '../repositories/userRepository.js'
import { createHashId } from '../utils/identity.js'

// Feedback service handles review eligibility, stats, and persistence.
export const getFeedbackList = ({ bookingId, userId, restaurantId, limit } = {}) => {
  const filter = {}
  if (bookingId) filter.bookingId = String(bookingId)
  if (userId) filter.userId = String(userId)
  if (restaurantId) filter.restaurantId = String(restaurantId)

  return listFeedback(filter, limit)
}

export const getFeedbackEligibility = async ({ bookingId, userId }) => {
  const booking = await findBookingById(bookingId)
  const existing = await findFeedbackByBookingId(bookingId)

  return evaluateFeedbackGate({
    booking,
    userId: String(userId || ''),
    hasExistingFeedback: Boolean(existing)
  })
}

export const submitFeedbackForBooking = async (payload) => {
  const booking = await findBookingById(payload.bookingId)
  const existing = await findFeedbackByBookingId(payload.bookingId)

  const gate = evaluateFeedbackGate({
    booking,
    userId: payload.userId,
    hasExistingFeedback: Boolean(existing)
  })

  if (!gate.allowed) {
    return { ok: false, status: 400, message: gate.reason }
  }

  const feed = {
    id: payload.id || createHashId('F', `${payload.bookingId}-${Date.now()}`),
    bookingId: payload.bookingId,
    userId: payload.userId,
    restaurantId: payload.restaurantId,
    rating: payload.rating,
    review: payload.review,
    serviceRating: payload.serviceRating,
    foodRating: payload.foodRating,
    ambianceRating: payload.ambianceRating,
    submittedAt: payload.submittedAt || new Date().toISOString(),
    createdAt: payload.createdAt || new Date().toISOString(),
    source: payload.source || 'runtime'
  }

  const savedFeedback = await upsertFeedbackById(feed)

  await updateBookingById(booking.id, buildFeedbackLinkedBookingPatch({ booking, feedbackId: feed.id }))

  return { ok: true, status: 201, data: savedFeedback }
}

export const upsertFeedbackRecord = async (payload) => {
  if (!payload.id) {
    return { ok: false, status: 400, message: 'Feedback id is required' }
  }

  const savedFeedback = await upsertFeedbackById(payload)
  return { ok: true, status: 201, data: savedFeedback }
}

export const buildRestaurantFeedbackStats = async (restaurantId) => {
  const [feedbackRows, users] = await Promise.all([
    listFeedback({ restaurantId }),
    listUsers()
  ])

  const userMap = new Map(users.map((user) => [user.id, user]))
  const allReviews = feedbackRows
    .map((row) => ({
      ...row,
      reviewerName: userMap.get(row.userId)?.name || 'Guest User'
    }))
    .sort((a, b) => new Date(b.submittedAt || b.createdAt || 0).getTime() - new Date(a.submittedAt || a.createdAt || 0).getTime())

  const reviewCount = allReviews.length
  const averageRating = reviewCount > 0
    ? allReviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviewCount
    : 0

  return {
    reviewCount,
    averageRating,
    allReviews,
    recentReviews: allReviews.slice(0, 6)
  }
}