import { Booking } from '../models/index.js'

// Booking repository isolates all persistence concerns for reservations.
export const countBookings = () => Booking.estimatedDocumentCount()

export const listBookings = (filter = {}, limit) => {
  const query = Booking.find(filter)
  const parsedLimit = Number(limit)

  if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
    query.limit(parsedLimit)
  }

  return query.lean()
}

export const findBookingById = (id) => Booking.findOne({ id }).lean()

export const findBookingsByUserId = (userId) => Booking.find({ userId }).lean()

export const findUpcomingBookings = () => Booking.find({ bookingStatus: 'Upcoming' }).lean()

export const upsertBookingById = (booking) => Booking.findOneAndUpdate(
  { id: booking.id },
  { $set: booking },
  { upsert: true, new: true, runValidators: true, context: 'query' }
).lean()

export const updateBookingById = (id, patch) => Booking.findOneAndUpdate(
  { id },
  { $set: patch },
  { upsert: false, new: true, runValidators: true, context: 'query' }
).lean()