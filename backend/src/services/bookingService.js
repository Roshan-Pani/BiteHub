import {
  evaluateCancellationPolicy,
  toDateTime
} from '../../../shared/bookingRules.js'
import { buildCancelledBookingPatch } from '../hooks/bookingLifecycleHooks.js'
import {
  findBookingById,
  findBookingsByUserId,
  findUpcomingBookings,
  listBookings,
  updateBookingById,
  upsertBookingById
} from '../repositories/bookingRepository.js'

// Booking service owns reservation policy and orchestration.
export const getBookingList = ({ userId, restaurantId, bookingStatus, paymentStatus, limit } = {}) => {
  const filter = {}
  if (userId) filter.userId = String(userId)
  if (restaurantId) filter.restaurantId = String(restaurantId)
  if (bookingStatus) filter.bookingStatus = String(bookingStatus)
  if (paymentStatus) filter.paymentStatus = String(paymentStatus)

  return listBookings(filter, limit)
}

export const getBookingById = (id) => findBookingById(id)

export const getBookingsForUser = (userId) => findBookingsByUserId(userId)

export const getBookingCancellationPolicy = (booking) => evaluateCancellationPolicy({ booking })

export const cancelBookingById = async (bookingId) => {
  const booking = await findBookingById(bookingId)
  const policy = getBookingCancellationPolicy(booking)

  if (!policy.allowed) {
    return { ok: false, status: 400, message: policy.reason }
  }

  const updated = buildCancelledBookingPatch({
    booking,
    reason: 'Cancelled by user from My Bookings.'
  })

  return {
    ok: true,
    status: 200,
    data: await updateBookingById(bookingId, updated)
  }
}

export const autoCancelExpiredBookingRows = async () => {
  const upcoming = await findUpcomingBookings()
  const now = Date.now()

  const expired = upcoming.filter((booking) => {
    const when = toDateTime(booking.date, booking.time)
    return Boolean(when && when.getTime() < now)
  })

  if (expired.length === 0) {
    return { updated: 0 }
  }

  await Promise.all(expired.map(async (booking) => {
    const updated = buildCancelledBookingPatch({
      booking,
      reason: 'Auto-cancelled after booking time elapsed.'
    })

    await updateBookingById(booking.id, updated)
  }))

  return { updated: expired.length }
}

export const createOrReplaceBooking = (payload) => {
  if (!payload.id) {
    return Promise.resolve({ ok: false, status: 400, message: 'Booking id is required' })
  }

  return upsertBookingById(payload).then((booking) => ({ ok: true, status: 201, data: booking }))
}

export const toBookingDateTime = toDateTime