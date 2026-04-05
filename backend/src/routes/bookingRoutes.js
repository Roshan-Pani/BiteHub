import express from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { requireBodyFields } from '../middlewares/validateRequest.js'
import {
  autoCancelExpiredBookings,
  cancelBooking,
  getBooking,
  getCancellationPolicy,
  listBookings,
  listBookingsForUser,
  upsertBooking
} from '../controllers/bookingController.js'

// Booking routes remain API-compatible while the implementation is layered.
export const bookingRouter = express.Router()

bookingRouter.get('/bookings', asyncHandler(listBookings))
bookingRouter.get('/bookings/user/:userId', asyncHandler(listBookingsForUser))
bookingRouter.get('/bookings/:id', asyncHandler(getBooking))
bookingRouter.get('/bookings/:id/cancellation-policy', asyncHandler(getCancellationPolicy))
bookingRouter.post('/bookings/:id/cancel', asyncHandler(cancelBooking))
bookingRouter.post('/bookings/auto-cancel', asyncHandler(autoCancelExpiredBookings))
bookingRouter.post('/bookings', requireBodyFields(['id']), asyncHandler(upsertBooking))