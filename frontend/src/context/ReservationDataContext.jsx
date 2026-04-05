import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  countWords,
  evaluateCancellationPolicy as evaluateCancellationPolicyRule,
  normalizePaymentStatus
} from './reservationDataRules'
import {
  autoCancelExpiredBookingsFromApi,
  cancelBooking,
  getBookings,
  getCancellationPolicy,
  getFeedback,
  getFeedbackEligibility,
  getPayments,
  getUsers,
  resolveUserIdentityFromApi,
  submitFeedback,
  upsertBooking,
  upsertPayment
} from '../services/reservationApi'
import { getRestaurants } from '../services/restaurantApi'

const ReservationDataContext = createContext(null)

const normalizeEmail = (email) => (email || '').trim().toLowerCase()

const createHashId = (prefix, value) => {
  let hash = 0
  const source = String(value || '')
  for (let index = 0; index < source.length; index += 1) {
    hash = ((hash << 5) - hash) + source.charCodeAt(index)
    hash |= 0
  }
  return `${prefix}${Math.abs(hash)}`
}

const withReviewerName = (feed, userMap) => ({
  ...feed,
  reviewerName: userMap.get(feed.userId)?.name || 'Guest User'
})

const computeRestaurantStats = ({ restaurantId, feedbackList, userMap }) => {
  const allReviews = feedbackList
    .filter((item) => item.restaurantId === restaurantId)
    .map((item) => withReviewerName(item, userMap))
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

export const ReservationDataProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [feedback, setFeedback] = useState([])
  const [payments, setPayments] = useState([])
  const [restaurants, setRestaurants] = useState([])

  const refreshAll = useCallback(async () => {
    try {
      const [restaurantRows, userRows, bookingRows, feedbackRows, paymentRows] = await Promise.all([
        getRestaurants(),
        getUsers(),
        getBookings(),
        getFeedback(),
        getPayments()
      ])

      setRestaurants(Array.isArray(restaurantRows) ? restaurantRows : [])
      setUsers(Array.isArray(userRows) ? userRows : [])
      setBookings(Array.isArray(bookingRows) ? bookingRows : [])
      setFeedback(Array.isArray(feedbackRows) ? feedbackRows : [])
      setPayments(Array.isArray(paymentRows) ? paymentRows : [])
    } catch {
      setRestaurants([])
      setUsers([])
      setBookings([])
      setFeedback([])
      setPayments([])
    }
  }, [])

  useEffect(() => {
    refreshAll()
  }, [refreshAll])

  const userMap = useMemo(() => {
    return new Map(users.map((user) => [user.id, user]))
  }, [users])

  const getFeeds = useCallback(() => {
    return feedback
  }, [feedback])

  const getBookingById = useCallback((bookingId) => {
    return bookings.find((booking) => booking.id === bookingId) || null
  }, [bookings])

  const getBookingsForUser = useCallback((userId) => {
    return bookings
      .filter((booking) => booking.userId === userId)
      .sort((a, b) => new Date(`${b.date || '1970-01-01'}T00:00:00`).getTime() - new Date(`${a.date || '1970-01-01'}T00:00:00`).getTime())
  }, [bookings])

  const hasFeedbackForBooking = useCallback((bookingId) => {
    return feedback.some((item) => item.bookingId === bookingId)
  }, [feedback])

  const canSubmitFeedback = useCallback(({ booking, userId }) => {
    if (!booking) return { allowed: false, reason: 'Booking not found.' }
    if (!userId || booking.userId !== userId) {
      return { allowed: false, reason: 'You can submit feedback only for your own booking.' }
    }
    if (String(booking.bookingStatus || '').toLowerCase() !== 'completed') {
      return { allowed: false, reason: 'Feedback is allowed only for completed bookings.' }
    }
    if (hasFeedbackForBooking(booking.id)) {
      return { allowed: false, reason: 'Feedback already submitted for this booking.' }
    }
    return { allowed: true, reason: '' }
  }, [hasFeedbackForBooking])

  const getRestaurantByBooking = useCallback((booking) => {
    if (!booking) return null
    if (booking.restaurant?.id) return booking.restaurant
    return restaurants.find((restaurant) => restaurant.id === booking.restaurantId) || null
  }, [restaurants])

  const getRestaurantFeedbackStats = useCallback((restaurantId) => {
    return computeRestaurantStats({
      restaurantId,
      feedbackList: feedback,
      userMap
    })
  }, [feedback, userMap])

  const evaluateCancellationPolicy = useCallback((booking) => {
    return evaluateCancellationPolicyRule({ booking })
  }, [])

  const createRuntimeBooking = useCallback(async (payload) => {
    const booking = {
      ...payload,
      paymentStatus: normalizePaymentStatus(payload.paymentStatus),
      source: payload.source || 'runtime',
      createdAt: payload.createdAt || new Date().toISOString()
    }

    setBookings((prev) => [booking, ...prev.filter((item) => item.id !== booking.id)])

    try {
      await upsertBooking(booking)
    } catch {
      // UI already updated optimistically for smoother flow.
    }

    return booking
  }, [])

  const updateRuntimeBooking = useCallback(async (bookingId, patchOrUpdater) => {
    const current = bookings.find((entry) => entry.id === bookingId)
    if (!current) return null

    const patch = typeof patchOrUpdater === 'function'
      ? patchOrUpdater(current)
      : patchOrUpdater

    const nextBooking = {
      ...current,
      ...(patch || {})
    }

    if (patch?.paymentStatus) {
      nextBooking.paymentStatus = normalizePaymentStatus(patch.paymentStatus)
    }

    setBookings((prev) => prev.map((entry) => (entry.id === bookingId ? nextBooking : entry)))

    try {
      await upsertBooking(nextBooking)
    } catch {
      // Keep optimistic state.
    }

    return nextBooking
  }, [bookings])

  const cancelRuntimeBooking = useCallback(async (bookingId) => {
    try {
      const updated = await cancelBooking(bookingId)
      setBookings((prev) => prev.map((entry) => (entry.id === bookingId ? updated : entry)))
      return { ok: true }
    } catch {
      try {
        const policy = await getCancellationPolicy(bookingId)
        return { ok: false, reason: policy.reason || 'Unable to cancel booking.' }
      } catch {
        return { ok: false, reason: 'Unable to cancel booking.' }
      }
    }
  }, [])

  const autoCancelExpiredBookings = useCallback(async () => {
    try {
      await autoCancelExpiredBookingsFromApi()
      await refreshAll()
    } catch {
      // Ignore network failures for background reconciliation.
    }
  }, [refreshAll])

  const upsertPaymentForBooking = useCallback(async (payload) => {
    const payment = {
      id: payload.id || createHashId('P', `${payload.bookingId}-${Date.now()}`),
      bookingId: payload.bookingId,
      userId: payload.userId,
      restaurantId: payload.restaurantId,
      amount: payload.amount,
      method: payload.method,
      status: payload.status,
      meta: payload.meta || {},
      createdAt: payload.createdAt || new Date().toISOString()
    }

    setPayments((prev) => [payment, ...prev.filter((item) => item.id !== payment.id)])

    try {
      await upsertPayment(payment)
    } catch {
      // Keep optimistic state.
    }

    return payment
  }, [])

  const submitFeedbackOnce = useCallback(async ({ booking, user, payload }) => {
    if (!booking) return { ok: false, error: 'Booking not found.' }

    const feed = {
      id: createHashId('F', `${booking.id}-${Date.now()}`),
      bookingId: booking.id,
      userId: user.id,
      restaurantId: booking.restaurantId,
      rating: payload.rating,
      review: payload.review,
      serviceRating: payload.serviceRating,
      foodRating: payload.foodRating,
      ambianceRating: payload.ambianceRating,
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      source: 'runtime'
    }

    try {
      const eligibility = await getFeedbackEligibility({ bookingId: booking.id, userId: user.id })
      if (!eligibility.allowed) {
        return { ok: false, error: eligibility.reason }
      }

      const saved = await submitFeedback(feed)
      setFeedback((prev) => [saved, ...prev.filter((entry) => entry.id !== saved.id)])
      setBookings((prev) => prev.map((entry) => (
        entry.id === booking.id
          ? { ...entry, feedbackSubmitted: true, feedbackId: saved.id }
          : entry
      )))
      return { ok: true, feedback: saved }
    } catch {
      return { ok: false, error: 'Unable to submit feedback.' }
    }
  }, [])

  const resolveUserIdentity = useCallback(({ email, name, phone }) => {
    const safeEmail = normalizeEmail(email)
    const local = users.find((entry) => normalizeEmail(entry.email) === safeEmail)
    if (local) {
      return Promise.resolve({
        id: local.id,
        isSeedUser: true,
        name: local.name,
        email: local.email,
        phone: local.phone || phone || ''
      })
    }

    return resolveUserIdentityFromApi({ email: safeEmail, name, phone })
      .then((identity) => {
        refreshAll()
        return identity
      })
      .catch(() => {
        const fallbackName = (name || safeEmail.split('@')[0] || 'Guest User').trim() || 'Guest User'
        return {
          id: createHashId('U', safeEmail || fallbackName),
          isSeedUser: false,
          name: fallbackName,
          email: safeEmail || `${fallbackName.replace(/\s+/g, '').toLowerCase()}@guest.local`,
          phone: phone || ''
        }
      })
  }, [users, refreshAll])

  const hasRuntimeBooking = useCallback((bookingId) => {
    return String(bookingId || '').startsWith('BKG')
  }, [])

  const resetContext = useCallback(() => {
    refreshAll()
  }, [refreshAll])

  const value = useMemo(() => ({
    countWords,
    getFeeds,
    getBookingById,
    getBookingsForUser,
    getRestaurantByBooking,
    getRestaurantFeedbackStats,
    hasFeedbackForBooking,
    hasRuntimeBooking,
    canSubmitFeedback,
    createRuntimeBooking,
    updateRuntimeBooking,
    cancelRuntimeBooking,
    autoCancelExpiredBookings,
    evaluateCancellationPolicy,
    upsertPaymentForBooking,
    submitFeedbackOnce,
    resolveUserIdentity,
    resetContext
  }), [
    getFeeds,
    getBookingById,
    getBookingsForUser,
    getRestaurantByBooking,
    getRestaurantFeedbackStats,
    hasFeedbackForBooking,
    hasRuntimeBooking,
    canSubmitFeedback,
    createRuntimeBooking,
    updateRuntimeBooking,
    cancelRuntimeBooking,
    autoCancelExpiredBookings,
    evaluateCancellationPolicy,
    upsertPaymentForBooking,
    submitFeedbackOnce,
    resolveUserIdentity,
    resetContext
  ])

  return (
    <ReservationDataContext.Provider value={value}>
      {children}
    </ReservationDataContext.Provider>
  )
}

export const useReservationData = () => {
  const context = useContext(ReservationDataContext)
  if (!context) {
    throw new Error('useReservationData must be used inside ReservationDataProvider')
  }
  return context
}
