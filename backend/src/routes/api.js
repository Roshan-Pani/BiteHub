import express from 'express'
import { Booking, Feedback, Payment, Restaurant, User } from '../models/index.js'
import { getMenuForRestaurant, getSeatsBySlot } from '../data/seedSources.js'

export const apiRouter = express.Router()

const CANCEL_CUTOFF_MS = 2 * 60 * 60 * 1000

const normalizeEmail = (email) => String(email || '').trim().toLowerCase()

const createHashId = (prefix, value) => {
  let hash = 0
  const source = String(value || '')
  for (let index = 0; index < source.length; index += 1) {
    hash = ((hash << 5) - hash) + source.charCodeAt(index)
    hash |= 0
  }
  return `${prefix}${Math.abs(hash)}`
}

const parseMeridianTime = (value) => {
  if (!value || typeof value !== 'string') return null
  if (value.includes(':') && !value.includes('AM') && !value.includes('PM')) {
    const [h, m] = value.split(':').map(Number)
    if (Number.isNaN(h) || Number.isNaN(m)) return null
    return { hours: h, minutes: m }
  }

  const [clock, period] = value.trim().split(' ')
  if (!clock || !period) return null
  let [hours, minutes] = clock.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  return { hours, minutes }
}

const toDateTime = (date, time) => {
  if (!date || !time) return null
  const parsed = parseMeridianTime(time)
  if (!parsed) return null

  const dt = new Date(`${date}T00:00:00`)
  if (Number.isNaN(dt.getTime())) return null
  dt.setHours(parsed.hours, parsed.minutes, 0, 0)
  return dt
}

const evaluateCancellationPolicy = (booking) => {
  if (!booking) return { allowed: false, reason: 'Booking not found.' }
  if (String(booking.bookingStatus || '').toLowerCase() !== 'upcoming') {
    return { allowed: false, reason: 'Only upcoming bookings can be cancelled.' }
  }

  const bookingDateTime = toDateTime(booking.date, booking.time)
  if (!bookingDateTime) return { allowed: true, reason: '' }

  const diff = bookingDateTime.getTime() - Date.now()
  if (diff < CANCEL_CUTOFF_MS) {
    return { allowed: false, reason: 'Cancellation closes 2 hours before booking time.' }
  }

  return { allowed: true, reason: '' }
}

const evaluateFeedbackGate = ({ booking, userId, hasExistingFeedback }) => {
  if (!booking) return { allowed: false, reason: 'Booking not found.' }
  if (!userId || booking.userId !== userId) {
    return { allowed: false, reason: 'You can submit feedback only for your own booking.' }
  }
  if (String(booking.bookingStatus || '').toLowerCase() !== 'completed') {
    return { allowed: false, reason: 'Feedback is allowed only for completed bookings.' }
  }

  const bookingTime = toDateTime(booking.date, booking.time)
  if (bookingTime && bookingTime.getTime() > Date.now()) {
    return { allowed: false, reason: 'Feedback is available after your dining time has passed.' }
  }

  if (hasExistingFeedback) {
    return { allowed: false, reason: 'Feedback already submitted for this booking.' }
  }

  return { allowed: true, reason: '' }
}

apiRouter.get('/health', async (_req, res) => {
  const [restaurants, users, bookings, feedback, payments] = await Promise.all([
    Restaurant.estimatedDocumentCount(),
    User.estimatedDocumentCount(),
    Booking.estimatedDocumentCount(),
    Feedback.estimatedDocumentCount(),
    Payment.estimatedDocumentCount()
  ])

  res.json({
    status: 'ok',
    collections: { restaurants, users, bookings, feedback, payments }
  })
})

apiRouter.get('/restaurants', async (_req, res) => {
  const restaurants = await Restaurant.find().lean()
  res.json(restaurants)
})

apiRouter.get('/restaurants/:id', async (req, res) => {
  const restaurant = await Restaurant.findOne({ id: req.params.id }).lean()
  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' })
  }
  return res.json(restaurant)
})

apiRouter.get('/restaurants/:id/feedback-stats', async (req, res) => {
  const restaurant = await Restaurant.findOne({ id: req.params.id }).lean()
  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' })
  }

  const [feedbackRows, users] = await Promise.all([
    Feedback.find({ restaurantId: req.params.id }).lean(),
    User.find().lean()
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

  return res.json({
    reviewCount,
    averageRating,
    allReviews,
    recentReviews: allReviews.slice(0, 6)
  })
})

apiRouter.get('/restaurants/:id/menu', async (req, res) => {
  const restaurant = await Restaurant.findOne({ id: req.params.id }).lean()
  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' })
  }

  const menu = getMenuForRestaurant(restaurant)
  return res.json(menu)
})

apiRouter.get('/restaurants/:id/seats', async (req, res) => {
  const { date = '', time = '' } = req.query
  const seats = getSeatsBySlot({
    restaurantId: req.params.id,
    date: String(date),
    time: String(time)
  })
  res.json(seats)
})

apiRouter.get('/users', async (_req, res) => {
  const users = await User.find().lean()
  res.json(users)
})

apiRouter.post('/users/resolve', async (req, res) => {
  const payload = req.body || {}
  const safeEmail = normalizeEmail(payload.email)
  if (!safeEmail) {
    return res.status(400).json({ message: 'Email is required' })
  }

  const found = await User.findOne({ email: safeEmail }).lean()
  if (found) {
    return res.json({
      id: found.id,
      isSeedUser: true,
      name: found.name,
      email: found.email,
      phone: found.phone || payload.phone || ''
    })
  }

  const fallbackName = (payload.name || safeEmail.split('@')[0] || 'Guest User').trim() || 'Guest User'
  const created = {
    id: createHashId('U', safeEmail),
    name: fallbackName,
    email: safeEmail,
    phone: payload.phone || '',
    isAuthenticated: true,
    source: 'runtime'
  }

  await User.findOneAndUpdate(
    { id: created.id },
    { $set: created },
    { upsert: true, new: true }
  ).lean()

  return res.status(201).json({
    id: created.id,
    isSeedUser: false,
    name: created.name,
    email: created.email,
    phone: created.phone
  })
})

apiRouter.get('/bookings', async (req, res) => {
  const {
    userId,
    restaurantId,
    bookingStatus,
    paymentStatus,
    limit
  } = req.query

  const filter = {}
  if (userId) filter.userId = String(userId)
  if (restaurantId) filter.restaurantId = String(restaurantId)
  if (bookingStatus) filter.bookingStatus = String(bookingStatus)
  if (paymentStatus) filter.paymentStatus = String(paymentStatus)

  const query = Booking.find(filter)
  const parsedLimit = Number(limit)
  if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
    query.limit(parsedLimit)
  }

  const bookings = await query.lean()
  res.json(bookings)
})

apiRouter.get('/bookings/user/:userId', async (req, res) => {
  const rows = await Booking.find({ userId: req.params.userId }).lean()
  rows.sort((a, b) => new Date(`${b.date || '1970-01-01'}T00:00:00`).getTime() - new Date(`${a.date || '1970-01-01'}T00:00:00`).getTime())
  res.json(rows)
})

apiRouter.get('/bookings/:id', async (req, res) => {
  const booking = await Booking.findOne({ id: req.params.id }).lean()
  if (!booking) return res.status(404).json({ message: 'Booking not found' })
  return res.json(booking)
})

apiRouter.get('/bookings/:id/cancellation-policy', async (req, res) => {
  const booking = await Booking.findOne({ id: req.params.id }).lean()
  const policy = evaluateCancellationPolicy(booking)
  return res.json(policy)
})

apiRouter.post('/bookings/:id/cancel', async (req, res) => {
  const booking = await Booking.findOne({ id: req.params.id }).lean()
  const policy = evaluateCancellationPolicy(booking)
  if (!policy.allowed) {
    return res.status(400).json({ message: policy.reason })
  }

  const updated = {
    ...booking,
    bookingStatus: 'Cancelled',
    paymentStatus: booking.paymentStatus || 'Cancelled',
    cancellation: {
      attemptedAt: new Date().toISOString(),
      allowed: true,
      reason: 'Cancelled by user from My Bookings.'
    }
  }

  const saved = await Booking.findOneAndUpdate(
    { id: req.params.id },
    { $set: updated },
    { upsert: false, new: true }
  ).lean()

  return res.json(saved)
})

apiRouter.post('/bookings/auto-cancel', async (_req, res) => {
  const upcoming = await Booking.find({ bookingStatus: 'Upcoming' }).lean()
  const now = Date.now()

  const expired = upcoming.filter((booking) => {
    const when = toDateTime(booking.date, booking.time)
    return Boolean(when && when.getTime() < now)
  })

  if (expired.length === 0) {
    return res.json({ updated: 0 })
  }

  await Promise.all(expired.map(async (booking) => {
    const updated = {
      ...booking,
      bookingStatus: 'Cancelled',
      paymentStatus: booking.paymentStatus || 'Cancelled',
      cancellation: {
        attemptedAt: new Date().toISOString(),
        allowed: true,
        reason: 'Auto-cancelled after booking time elapsed.'
      }
    }

    await Booking.findOneAndUpdate(
      { id: booking.id },
      { $set: updated },
      { upsert: false, new: true }
    ).lean()
  }))

  return res.json({ updated: expired.length })
})

apiRouter.post('/bookings', async (req, res) => {
  const payload = req.body || {}
  if (!payload.id) {
    return res.status(400).json({ message: 'Booking id is required' })
  }

  const booking = await Booking.findOneAndUpdate(
    { id: payload.id },
    { $set: payload },
    { upsert: true, new: true }
  ).lean()

  return res.status(201).json(booking)
})

apiRouter.get('/feedback', async (req, res) => {
  const {
    bookingId,
    userId,
    restaurantId,
    limit
  } = req.query

  const filter = {}
  if (bookingId) filter.bookingId = String(bookingId)
  if (userId) filter.userId = String(userId)
  if (restaurantId) filter.restaurantId = String(restaurantId)

  const query = Feedback.find(filter)
  const parsedLimit = Number(limit)
  if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
    query.limit(parsedLimit)
  }

  const feedback = await query.lean()
  res.json(feedback)
})

apiRouter.get('/feedback/eligibility/:bookingId', async (req, res) => {
  const { userId = '' } = req.query
  const booking = await Booking.findOne({ id: req.params.bookingId }).lean()
  const existing = await Feedback.findOne({ bookingId: req.params.bookingId }).lean()

  const gate = evaluateFeedbackGate({
    booking,
    userId: String(userId),
    hasExistingFeedback: Boolean(existing)
  })

  return res.json(gate)
})

apiRouter.post('/feedback/submit', async (req, res) => {
  const payload = req.body || {}
  const booking = await Booking.findOne({ id: payload.bookingId }).lean()
  const existing = await Feedback.findOne({ bookingId: payload.bookingId }).lean()

  const gate = evaluateFeedbackGate({
    booking,
    userId: payload.userId,
    hasExistingFeedback: Boolean(existing)
  })

  if (!gate.allowed) {
    return res.status(400).json({ message: gate.reason })
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

  const savedFeedback = await Feedback.findOneAndUpdate(
    { id: feed.id },
    { $set: feed },
    { upsert: true, new: true }
  ).lean()

  const updatedBooking = {
    ...booking,
    feedbackSubmitted: true,
    feedbackId: feed.id
  }

  await Booking.findOneAndUpdate(
    { id: booking.id },
    { $set: updatedBooking },
    { upsert: false, new: true }
  ).lean()

  return res.status(201).json(savedFeedback)
})

apiRouter.post('/feedback', async (req, res) => {
  const payload = req.body || {}
  if (!payload.id) {
    return res.status(400).json({ message: 'Feedback id is required' })
  }

  const feedback = await Feedback.findOneAndUpdate(
    { id: payload.id },
    { $set: payload },
    { upsert: true, new: true }
  ).lean()

  return res.status(201).json(feedback)
})

apiRouter.get('/payments', async (req, res) => {
  const {
    bookingId,
    userId,
    restaurantId,
    status,
    limit
  } = req.query

  const filter = {}
  if (bookingId) filter.bookingId = String(bookingId)
  if (userId) filter.userId = String(userId)
  if (restaurantId) filter.restaurantId = String(restaurantId)
  if (status) filter.status = String(status)

  const query = Payment.find(filter)
  const parsedLimit = Number(limit)
  if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
    query.limit(parsedLimit)
  }

  const payments = await query.lean()
  res.json(payments)
})

apiRouter.post('/payments', async (req, res) => {
  const payload = req.body || {}
  if (!payload.id) {
    return res.status(400).json({ message: 'Payment id is required' })
  }

  const payment = await Payment.findOneAndUpdate(
    { id: payload.id },
    { $set: payload },
    { upsert: true, new: true }
  ).lean()

  return res.status(201).json(payment)
})
