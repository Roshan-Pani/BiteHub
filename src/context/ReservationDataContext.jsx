import React, { createContext, useContext, useMemo, useState } from 'react'
import { users as seedUsers } from '../Data/users'
import { normalizedSeedBookings } from '../Data/bookings'
import { normalizedSeedFeedback } from '../Data/feedback'
import { restaurants } from '../Data/restaurants'
import {
  countWords,
  evaluateFeedbackGate,
  normalizePaymentStatus,
  toDateTime
} from './reservationDataRules'

const ReservationDataContext = createContext(null)

const RUNTIME_BOOKINGS_KEY = 'ctx-runtime-bookings'
const RUNTIME_FEEDBACK_KEY = 'ctx-runtime-feedback'
const RUNTIME_PAYMENTS_KEY = 'ctx-runtime-payments'
const RUNTIME_USERS_KEY = 'ctx-runtime-users'

const ONE_DAY_MS = 24 * 60 * 60 * 1000
const CANCEL_CUTOFF_MS = 2 * 60 * 60 * 1000
const MIN_REVIEWS_PER_RESTAURANT = 15

const safeParse = (value, fallback) => {
  try {
    const parsed = JSON.parse(value)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

const loadArray = (key) => {
  const raw = localStorage.getItem(key)
  if (!raw) return []
  const parsed = safeParse(raw, [])
  return Array.isArray(parsed) ? parsed : []
}

const saveArray = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const isExpired = (expiresAt) => {
  if (!expiresAt) return false
  const time = new Date(expiresAt).getTime()
  if (Number.isNaN(time)) return false
  return Date.now() > time
}

const attachExpiry = (record) => {
  if (!record || typeof record !== 'object') return record
  if (record.expiresAt) return record
  const created = record.createdAt ? new Date(record.createdAt).getTime() : Date.now()
  const safeCreated = Number.isNaN(created) ? Date.now() : created
  return {
    ...record,
    expiresAt: new Date(safeCreated + ONE_DAY_MS).toISOString()
  }
}

const normalizeRuntimeBooking = (record) => {
  const seatIds = record.bookingDetails?.selectedTableIds || record.selectedSeatIds || []
  const seatNumbers = record.bookingDetails?.selectedSeats?.map((seat) => seat.id) || record.seatNumbers || seatIds

  return {
    ...record,
    source: 'runtime',
    selectedSeatIds: seatIds,
    seatNumbers,
    paymentStatus: normalizePaymentStatus(record.paymentStatus)
  }
}

const normalizeSeedBooking = (record) => ({
  ...record,
  source: 'seed',
  paymentStatus: normalizePaymentStatus(record.paymentStatus)
})

const hashString = (value) => {
  let hash = 0
  const source = String(value)
  for (let i = 0; i < source.length; i += 1) {
    hash = ((hash << 5) - hash) + source.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const normalizeEmail = (email) => (email || '').trim().toLowerCase()

const syntheticReviewLines = [
  'Excellent service and well-paced course timing. The staff handled requests smoothly.',
  'Food quality was consistent across all dishes and portions were generous for the price.',
  'Ambience was clean and comfortable, and table spacing made the meal relaxed.',
  'Great flavor balance and fresh ingredients. Would visit again for family dining.',
  'Quick seating and friendly support from staff. Overall a reliable dining experience.',
  'Presentation was premium and the chef recommendations were worth trying.',
  'Good value for money with balanced menu choices for both veg and non-veg diners.',
  'Service team was attentive and polite. Meal arrived at the right pace throughout.'
]

const buildSyntheticRestaurantReviews = ({ restaurantId, existingCount, targetCount }) => {
  const required = Math.max(0, targetCount - existingCount)
  if (required === 0) return []

  const now = Date.now()
  const baseSeed = hashString(`REV-${restaurantId}`)

  return Array.from({ length: required }, (_, index) => {
    const seed = baseSeed + index
    const reviewer = seedUsers[seed % seedUsers.length]
    const rating = 3 + (seed % 3)
    const createdAt = new Date(now - ((index + 1) * 3 * 24 * 60 * 60 * 1000)).toISOString()

    return {
      id: `SF-${restaurantId}-${index + 1}`,
      bookingId: `SB-${restaurantId}-${index + 1}`,
      userId: reviewer?.id || 'U1',
      restaurantId,
      rating,
      review: syntheticReviewLines[seed % syntheticReviewLines.length],
      createdAt,
      submittedAt: createdAt,
      source: 'synthetic-min-review'
    }
  })
}

const ensureSeedCoverage = (bookings, feedback) => {
  const feedbackByBooking = new Set(feedback.map((item) => item.bookingId))
  const next = [...bookings]

  const getDateOffset = (daysOffset) => {
    const date = new Date()
    date.setDate(date.getDate() + daysOffset)
    return date.toISOString().split('T')[0]
  }

  const hasId = (id) => next.some((booking) => booking.id === id)

  const makeScenarioBooking = ({ user, restaurant, key, dateOffset, paymentStatus, bookingStatus, attended, paymentMethod = 'Card' }) => {
    const id = `SB-${user.id}-${key}`
    if (hasId(id)) return null

    const date = getDateOffset(dateOffset)
    const seatId = `T${(hashString(`${user.id}-${key}`) % 50) + 1}`
    const foodPreference = restaurant.isVegOnly ? 'Veg' : 'Non-Veg'

    return {
      id,
      userId: user.id,
      restaurantId: restaurant.id,
      restaurant,
      date,
      time: '7:30 PM',
      guests: [
        {
          id: `G-${id}`,
          name: user.name,
          age: '25',
          foodPreference,
          sex: 'Other'
        }
      ],
      selectedSeatIds: [seatId],
      seatNumbers: [seatId],
      bookingDetails: {
        date,
        time: '7:30 PM',
        guests: [
          {
            id: `G-${id}`,
            name: user.name,
            age: '25',
            foodPreference,
            sex: 'Other'
          }
        ],
        selectedTableIds: [seatId],
        selectedSeats: [{ id: seatId, type: 'Standard Table', status: 'Reserved' }]
      },
      paymentMethod,
      paymentStatus,
      bookingStatus,
      attended,
      pricing: {
        bookingBase: 180,
        costPerSeat: 90,
        selectedSeatCount: 1,
        subtotal: 270,
        discount: 27,
        total: 243
      },
      feedbackSubmitted: false,
      createdAt: `${date}T00:00:00.000Z`,
      statusTimeline: [
        {
          type: 'BOOKING_CREATED',
          status: bookingStatus,
          at: `${date}T00:00:00.000Z`,
          note: `Seed ${key} scenario for testing`
        }
      ],
      source: 'seed'
    }
  }

  seedUsers.forEach((user, index) => {
    const restaurant = restaurants[index % restaurants.length]
    const userBookings = next.filter((booking) => booking.userId === user.id)

    const hasEligible = userBookings.some((booking) => (
      booking.userId === user.id &&
      booking.bookingStatus === 'Completed' &&
      booking.attended === true &&
      !feedbackByBooking.has(booking.id)
    ))

    if (!hasEligible) {
      const completedAttended = makeScenarioBooking({
        user,
        restaurant,
        key: 'COMPLETED-ATTENDED',
        dateOffset: -7,
        paymentStatus: 'Paid',
        bookingStatus: 'Completed',
        attended: true
      })
      if (completedAttended) next.push(completedAttended)
    }

    const hasUpcomingPaid = userBookings.some((booking) => (
      booking.bookingStatus === 'Upcoming' && String(booking.paymentStatus || '').toLowerCase() === 'paid'
    ))
    if (!hasUpcomingPaid) {
      const upcomingPaid = makeScenarioBooking({
        user,
        restaurant: restaurants[(index + 7) % restaurants.length],
        key: 'UPCOMING-PAID',
        dateOffset: 5,
        paymentStatus: 'Paid',
        bookingStatus: 'Upcoming',
        attended: null
      })
      if (upcomingPaid) next.push(upcomingPaid)
    }

    const hasUpcomingPending = userBookings.some((booking) => (
      booking.bookingStatus === 'Upcoming' &&
      String(booking.paymentStatus || '').toLowerCase() === 'pending' &&
      ['restaurant', 'cash', 'pay at restaurant'].includes(String(booking.paymentMethod || '').toLowerCase())
    ))
    if (!hasUpcomingPending) {
      const upcomingPending = makeScenarioBooking({
        user,
        restaurant: restaurants[(index + 13) % restaurants.length],
        key: 'UPCOMING-PENDING',
        dateOffset: 3,
        paymentMethod: 'Pay at Restaurant',
        paymentStatus: 'Pending',
        bookingStatus: 'Upcoming',
        attended: null
      })
      if (upcomingPending) next.push(upcomingPending)
    }

    const hasCancelledAbsent = userBookings.some((booking) => (
      booking.bookingStatus === 'Cancelled' && booking.attended === false
    ))
    if (!hasCancelledAbsent) {
      const cancelledAbsent = makeScenarioBooking({
        user,
        restaurant: restaurants[(index + 21) % restaurants.length],
        key: 'CANCELLED-ABSENT',
        dateOffset: -2,
        paymentStatus: 'Cancelled',
        bookingStatus: 'Cancelled',
        attended: false
      })
      if (cancelledAbsent) {
        cancelledAbsent.cancellation = {
          attemptedAt: `${cancelledAbsent.date}T21:30:00.000Z`,
          allowed: true,
          reason: 'Auto-marked absent for test coverage.',
          refundEligible: false,
          refundAmount: 0,
          refundStatus: 'Not Applicable'
        }
        next.push(cancelledAbsent)
      }
    }
  })

  return next
}

export const ReservationDataProvider = ({ children }) => {
  const [runtimeBookings, setRuntimeBookings] = useState(() => {
    const loaded = loadArray(RUNTIME_BOOKINGS_KEY)
    const sanitized = loaded.map((item) => attachExpiry(item)).filter((item) => !isExpired(item.expiresAt))
    saveArray(RUNTIME_BOOKINGS_KEY, sanitized)
    return sanitized
  })

  const [runtimeFeedback, setRuntimeFeedback] = useState(() => {
    const loaded = loadArray(RUNTIME_FEEDBACK_KEY)
    const sanitized = loaded.map((item) => attachExpiry(item)).filter((item) => !isExpired(item.expiresAt))
    saveArray(RUNTIME_FEEDBACK_KEY, sanitized)
    return sanitized
  })

  const [runtimePayments, setRuntimePayments] = useState(() => {
    const loaded = loadArray(RUNTIME_PAYMENTS_KEY)
    const sanitized = loaded.map((item) => attachExpiry(item)).filter((item) => !isExpired(item.expiresAt))
    saveArray(RUNTIME_PAYMENTS_KEY, sanitized)
    return sanitized
  })

  const [runtimeUsers, setRuntimeUsers] = useState(() => loadArray(RUNTIME_USERS_KEY))

  const seedFeedback = useMemo(
    () => normalizedSeedFeedback.map((entry) => ({ ...entry, source: 'seed', submittedAt: entry.submittedAt || entry.createdAt })),
    []
  )

  const seedBookings = useMemo(
    () => ensureSeedCoverage(normalizedSeedBookings.map((entry) => normalizeSeedBooking(entry)), seedFeedback),
    [seedFeedback]
  )

  const allFeedback = useMemo(() => {
    const runtime = runtimeFeedback.map((entry) => ({ ...entry, source: 'runtime' }))
    return [...seedFeedback, ...runtime]
  }, [seedFeedback, runtimeFeedback])

  const allBookings = useMemo(() => {
    const runtime = runtimeBookings.map((entry) => normalizeRuntimeBooking(entry))
    const merged = new Map()

    seedBookings.forEach((entry) => {
      merged.set(entry.id, entry)
    })

    runtime.forEach((entry) => {
      merged.set(entry.id, entry)
    })

    return [...merged.values()]
  }, [seedBookings, runtimeBookings])

  const persistBookings = (next) => {
    setRuntimeBookings(next)
    saveArray(RUNTIME_BOOKINGS_KEY, next)
  }

  const persistFeedback = (next) => {
    setRuntimeFeedback(next)
    saveArray(RUNTIME_FEEDBACK_KEY, next)
  }

  const persistPayments = (next) => {
    setRuntimePayments(next)
    saveArray(RUNTIME_PAYMENTS_KEY, next)
  }

  const persistUsers = (next) => {
    setRuntimeUsers(next)
    saveArray(RUNTIME_USERS_KEY, next)
  }

  const resolveUserIdentity = ({ email, name, phone }) => {
    const cleanEmail = normalizeEmail(email)
    const seedUser = seedUsers.find((entry) => normalizeEmail(entry.email) === cleanEmail)
    if (seedUser) {
      return {
        id: seedUser.id,
        isSeedUser: true,
        name: name || seedUser.name,
        email: cleanEmail,
        phone: phone || seedUser.phone || ''
      }
    }

    const runtimeUser = runtimeUsers.find((entry) => normalizeEmail(entry.email) === cleanEmail)
    if (runtimeUser) {
      return {
        id: runtimeUser.id,
        isSeedUser: false,
        name: name || runtimeUser.name,
        email: cleanEmail,
        phone: phone || runtimeUser.phone || ''
      }
    }

    const syntheticId = `NU${hashString(cleanEmail || `${name}-${phone}`)}`
    const newUser = {
      id: syntheticId,
      name: name || 'New User',
      email: cleanEmail,
      phone: phone || '',
      createdAt: new Date().toISOString()
    }

    persistUsers([...runtimeUsers, newUser])
    return {
      ...newUser,
      isSeedUser: false
    }
  }

  const getBookingById = (bookingId) => allBookings.find((entry) => entry.id === bookingId) || null

  const getBookingsForUser = (userId) => {
    return allBookings
      .filter((entry) => entry.userId === userId)
      .sort((a, b) => {
        const aTime = toDateTime(a.date, a.time)?.getTime() || 0
        const bTime = toDateTime(b.date, b.time)?.getTime() || 0
        return bTime - aTime
      })
  }

  const createRuntimeBooking = (payload) => {
    const id = payload.id || `BKG${Date.now()}`
    const booking = attachExpiry({
      ...payload,
      id,
      paymentStatus: normalizePaymentStatus(payload.paymentStatus),
      createdAt: payload.createdAt || new Date().toISOString(),
      statusTimeline: [
        {
          type: 'BOOKING_CREATED',
          status: payload.bookingStatus || 'Upcoming',
          at: payload.createdAt || new Date().toISOString(),
          note: 'Booking created'
        }
      ]
    })

    persistBookings([...runtimeBookings, booking])
    return booking
  }

  const updateRuntimeBooking = (bookingId, patch) => {
    const index = runtimeBookings.findIndex((entry) => entry.id === bookingId)
    if (index === -1) {
      const existingSeed = allBookings.find((entry) => entry.id === bookingId)
      if (!existingSeed) return null

      const updates = typeof patch === 'function' ? patch(existingSeed) : patch
      const runtimeClone = attachExpiry({
        ...existingSeed,
        ...updates,
        source: 'runtime',
        paymentStatus: updates?.paymentStatus ? normalizePaymentStatus(updates.paymentStatus) : existingSeed.paymentStatus,
        updatedAt: new Date().toISOString()
      })

      persistBookings([...runtimeBookings, runtimeClone])
      return runtimeClone
    }

    const existing = runtimeBookings[index]
    const updates = typeof patch === 'function' ? patch(existing) : patch
    const next = attachExpiry({
      ...existing,
      ...updates,
      paymentStatus: updates?.paymentStatus ? normalizePaymentStatus(updates.paymentStatus) : existing.paymentStatus,
      updatedAt: new Date().toISOString()
    })

    const merged = [...runtimeBookings]
    merged[index] = next
    persistBookings(merged)
    return next
  }

  const hasRuntimeBooking = (bookingId) => runtimeBookings.some((entry) => entry.id === bookingId)

  const evaluateCancellationPolicy = (booking) => {
    const dateTime = toDateTime(booking?.date, booking?.time)
    if (!dateTime) {
      return { allowed: false, reason: 'Invalid booking time.', refundEligible: false, refundAmount: 0 }
    }

    const delta = dateTime.getTime() - Date.now()
    if (delta <= 0) {
      return { allowed: false, reason: 'Past bookings cannot be cancelled.', refundEligible: false, refundAmount: 0 }
    }

    if (delta < CANCEL_CUTOFF_MS) {
      return {
        allowed: false,
        reason: 'Cancellation is allowed only up to 2 hours before booking time.',
        refundEligible: false,
        refundAmount: 0
      }
    }

    const refundAmount = String(booking.paymentStatus || '').toLowerCase() === 'paid' ? (booking.pricing?.total || 0) : 0
    return { allowed: true, reason: '', refundEligible: refundAmount > 0, refundAmount }
  }

  const cancelRuntimeBooking = (bookingId) => {
    const booking = getBookingById(bookingId)
    const policy = evaluateCancellationPolicy(booking)
    if (!policy.allowed) {
      return updateRuntimeBooking(bookingId, {
        cancellation: {
          attemptedAt: new Date().toISOString(),
          allowed: false,
          reason: policy.reason,
          refundEligible: false,
          refundAmount: 0
        }
      })
    }

    return updateRuntimeBooking(bookingId, {
      bookingStatus: 'Cancelled',
      paymentStatus: String(booking.paymentStatus || '').toLowerCase() === 'paid' ? 'Cancelled' : booking.paymentStatus,
      cancelledAt: new Date().toISOString(),
      cancellation: {
        attemptedAt: new Date().toISOString(),
        allowed: true,
        reason: '',
        refundEligible: policy.refundEligible,
        refundAmount: policy.refundAmount,
        refundStatus: policy.refundEligible ? 'Processed' : 'Not Applicable'
      }
    })
  }

  const getRestaurantByBooking = (booking) => {
    if (booking?.restaurant) return booking.restaurant
    return restaurants.find((item) => item.id === booking?.restaurantId) || null
  }

  const getFeedbackForBooking = (bookingId) => allFeedback.find((entry) => entry.bookingId === bookingId) || null
  const hasFeedbackForBooking = (bookingId) => Boolean(getFeedbackForBooking(bookingId))

  const canSubmitFeedback = ({ booking, userId }) => {
    const gate = evaluateFeedbackGate({
      booking,
      userId,
      nowMs: Date.now(),
      hasExistingFeedback: Boolean(booking?.id && hasFeedbackForBooking(booking.id))
    })
    if (!gate.allowed) return gate

    if (booking?.attended !== true) {
      return { allowed: false, reason: 'Feedback is available only for attended bookings confirmed by restaurant.' }
    }

    return gate
  }

  const submitFeedbackOnce = ({ booking, user, payload }) => {
    const gate = canSubmitFeedback({ booking, userId: user?.id })
    if (!gate.allowed) return { ok: false, error: gate.reason }

    if (countWords(payload.review) > 500) {
      return { ok: false, error: 'Review must be 500 words or fewer.' }
    }

    const feedback = attachExpiry({
      id: `RF${Date.now()}`,
      bookingId: booking.id,
      userId: user.id,
      restaurantId: booking.restaurantId,
      rating: payload.rating,
      review: payload.review,
      foodRating: payload.foodRating || 0,
      serviceRating: payload.serviceRating || 0,
      ambianceRating: payload.ambianceRating || 0,
      userName: user.name,
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    })

    persistFeedback([...runtimeFeedback, feedback])
    updateRuntimeBooking(booking.id, {
      feedbackSubmitted: true,
      feedbackSubmittedAt: new Date().toISOString()
    })

    return { ok: true, data: feedback }
  }

  const upsertPaymentForBooking = ({ bookingId, userId, restaurantId, amount, method, status, meta }) => {
    const existingIndex = runtimePayments.findIndex((entry) => entry.bookingId === bookingId)
    const now = new Date().toISOString()

    if (existingIndex === -1) {
      const payment = attachExpiry({
        id: `PAY${Date.now()}`,
        bookingId,
        userId,
        restaurantId,
        amount: Number(amount || 0),
        method: method || 'Unknown',
        status: normalizePaymentStatus(status),
        meta: meta || {},
        createdAt: now,
        updatedAt: now
      })
      persistPayments([...runtimePayments, payment])
      return payment
    }

    const next = [...runtimePayments]
    next[existingIndex] = attachExpiry({
      ...next[existingIndex],
      amount: amount == null ? next[existingIndex].amount : Number(amount),
      method: method || next[existingIndex].method,
      status: normalizePaymentStatus(status),
      meta: {
        ...(next[existingIndex].meta || {}),
        ...(meta || {})
      },
      updatedAt: now
    })
    persistPayments(next)
    return next[existingIndex]
  }

  const getRestaurantFeedbackStats = (restaurantId) => {
    const base = allFeedback.filter((entry) => entry.restaurantId === restaurantId)
    const synthetic = buildSyntheticRestaurantReviews({
      restaurantId,
      existingCount: base.length,
      targetCount: MIN_REVIEWS_PER_RESTAURANT
    })
    const all = [...base, ...synthetic]

    const averageRating = Number((all.reduce((sum, entry) => sum + (entry.rating || 0), 0) / all.length).toFixed(1))

    const sortedReviews = [...all]
      .sort((a, b) => {
        const aTime = new Date(a.submittedAt || a.createdAt || 0).getTime()
        const bTime = new Date(b.submittedAt || b.createdAt || 0).getTime()
        return bTime - aTime
      })
      .map((entry) => ({
        id: entry.id || `${entry.bookingId}-${entry.userId}`,
        reviewerName: entry.userName || seedUsers.find((item) => item.id === entry.userId)?.name || 'Verified Diner',
        rating: entry.rating,
        review: entry.review,
        submittedAt: entry.submittedAt || entry.createdAt || ''
      }))

    const recentReviews = sortedReviews.slice(0, 5)

    return {
      averageRating,
      reviewCount: all.length,
      recentReviews,
      allReviews: sortedReviews
    }
  }

  const getFeeds = () => allFeedback

  const resetContext = () => {
    localStorage.removeItem(RUNTIME_BOOKINGS_KEY)
    localStorage.removeItem(RUNTIME_FEEDBACK_KEY)
    localStorage.removeItem(RUNTIME_PAYMENTS_KEY)
    localStorage.removeItem(RUNTIME_USERS_KEY)
    setRuntimeBookings([])
    setRuntimeFeedback([])
    setRuntimePayments([])
    setRuntimeUsers([])
  }

  const autoCancelExpiredBookings = () => {
    const now = Date.now()
    const updated = runtimeBookings.map((booking) => {
      if (booking.bookingStatus !== 'Upcoming') return booking

      const bookingTime = toDateTime(booking.date, booking.time)
      if (!bookingTime) return booking

      const bookingTimeMs = bookingTime.getTime()
      if (now > bookingTimeMs) {
        return {
          ...booking,
          attended: false,
          bookingStatus: 'Cancelled',
          cancelledAt: new Date().toISOString(),
          cancellation: {
            attemptedAt: new Date().toISOString(),
            allowed: true,
            reason: 'Auto-marked absent: booking time has passed without attendance confirmation.',
            refundEligible: false,
            refundAmount: 0,
            refundStatus: 'Not Applicable'
          }
        }
      }
      return booking
    })

    if (updated.some((b, i) => b !== runtimeBookings[i])) {
      persistBookings(updated)
    }
  }

  const value = {
    resolveUserIdentity,
    getBookingById,
    getBookingsForUser,
    createRuntimeBooking,
    updateRuntimeBooking,
    hasRuntimeBooking,
    evaluateCancellationPolicy,
    cancelRuntimeBooking,
    getRestaurantByBooking,
    countWords,
    canSubmitFeedback,
    hasFeedbackForBooking,
    submitFeedbackOnce,
    upsertPaymentForBooking,
    getRestaurantFeedbackStats,
    getFeeds,
    resetContext,
    autoCancelExpiredBookings
  }

  return (
    <ReservationDataContext.Provider value={value}>
      {children}
    </ReservationDataContext.Provider>
  )
}

export const useReservationData = () => {
  const context = useContext(ReservationDataContext)
  if (!context) {
    throw new Error('useReservationData must be used within ReservationDataProvider')
  }
  return context
}

