import test from 'node:test'
import assert from 'node:assert/strict'
import { Booking } from '../models/index.js'
import { cancelBookingById } from '../services/bookingService.js'
import { submitFeedbackForBooking } from '../services/feedbackService.js'
import { resetTestDatabase, startTestDatabase, stopTestDatabase } from './testDb.js'

let mongoServer

test.before(async () => {
  mongoServer = await startTestDatabase()
})

test.beforeEach(async () => {
  await resetTestDatabase()
})

test.after(async () => {
  await stopTestDatabase(mongoServer)
})

test('cancelBookingById blocks cancellation for non-upcoming bookings', async () => {
  await Booking.create({
    id: 'B-RULE-1',
    userId: 'U-1',
    restaurantId: 'R-1',
    date: '2020-01-01',
    time: '07:00 PM',
    bookingStatus: 'Completed',
    paymentStatus: 'Paid'
  })

  const result = await cancelBookingById('B-RULE-1')

  assert.equal(result.ok, false)
  assert.equal(result.status, 400)
  assert.match(String(result.message), /only upcoming bookings can be cancelled/i)
})

test('cancelBookingById cancels upcoming booking and appends cancellation timeline', async () => {
  await Booking.create({
    id: 'B-RULE-2',
    userId: 'U-2',
    restaurantId: 'R-2',
    date: '2099-12-31',
    time: '08:00 PM',
    bookingStatus: 'Upcoming',
    paymentStatus: 'Pending',
    statusTimeline: []
  })

  const result = await cancelBookingById('B-RULE-2')

  assert.equal(result.ok, true)
  assert.equal(result.status, 200)
  assert.equal(result.data?.bookingStatus, 'Cancelled')

  const timeline = Array.isArray(result.data?.statusTimeline) ? result.data.statusTimeline : []
  assert.equal(timeline.length > 0, true)
  assert.equal(timeline[timeline.length - 1]?.type, 'BOOKING_CANCELLED')
})

test('submitFeedbackForBooking blocks feedback from non-owner user', async () => {
  await Booking.create({
    id: 'B-RULE-3',
    userId: 'U-OWNER',
    restaurantId: 'R-3',
    date: '2020-03-03',
    time: '06:00 PM',
    bookingStatus: 'Completed',
    paymentStatus: 'Paid'
  })

  const result = await submitFeedbackForBooking({
    bookingId: 'B-RULE-3',
    userId: 'U-OTHER',
    restaurantId: 'R-3',
    rating: 4,
    review: 'Trying to submit for someone else'
  })

  assert.equal(result.ok, false)
  assert.equal(result.status, 400)
  assert.match(String(result.message), /only for your own booking/i)
})
