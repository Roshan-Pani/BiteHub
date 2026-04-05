import {
  autoCancelExpiredBookingRows,
  cancelBookingById,
  createOrReplaceBooking,
  getBookingById,
  getBookingCancellationPolicy,
  getBookingList,
  getBookingsForUser
} from '../services/bookingService.js'
import { sendServiceResult } from '../utils/serviceResult.js'

// Booking controller handles reservation transport and keeps policies in services.
export const listBookings = async (req, res) => {
  const bookings = await getBookingList(req.query)
  return res.json(bookings)
}

export const listBookingsForUser = async (req, res) => {
  const rows = await getBookingsForUser(req.params.userId)
  rows.sort((a, b) => new Date(`${b.date || '1970-01-01'}T00:00:00`).getTime() - new Date(`${a.date || '1970-01-01'}T00:00:00`).getTime())
  return res.json(rows)
}

export const getBooking = async (req, res) => {
  const booking = await getBookingById(req.params.id)
  if (!booking) return res.status(404).json({ message: 'Booking not found' })
  return res.json(booking)
}

export const getCancellationPolicy = async (req, res) => {
  const booking = await getBookingById(req.params.id)
  return res.json(getBookingCancellationPolicy(booking))
}

export const cancelBooking = async (req, res) => {
  const result = await cancelBookingById(req.params.id)
  return sendServiceResult(res, result)
}

export const autoCancelExpiredBookings = async (_req, res) => {
  const result = await autoCancelExpiredBookingRows()
  return res.json(result)
}

export const upsertBooking = async (req, res) => {
  const result = await createOrReplaceBooking(req.body || {})
  return sendServiceResult(res, result)
}