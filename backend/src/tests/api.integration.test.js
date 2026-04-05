import test from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'
import { app } from '../app.js'
import { Booking, Feedback, Payment, User } from '../models/index.js'
import { resetTestDatabase, startTestDatabase, stopTestDatabase } from './testDb.js'

let mongoServer
let server
let baseUrl

const request = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, options)
  let body = null

  try {
    body = await response.json()
  } catch {
    body = null
  }

  return { response, body }
}

test.before(async () => {
  mongoServer = await startTestDatabase()
  server = app.listen(0)
  await once(server, 'listening')
  const address = server.address()
  baseUrl = `http://127.0.0.1:${address.port}`
})

test.beforeEach(async () => {
  await resetTestDatabase()
})

test.after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error)
        else resolve()
      })
    })
  }

  await stopTestDatabase(mongoServer)
})

test('POST /api/users/resolve creates runtime identity for a new email', async () => {
  const { response, body } = await request('/api/users/resolve', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'new.user@example.com', name: 'New User', phone: '9999999999' })
  })

  assert.equal(response.status, 201)
  assert.equal(body?.isSeedUser, false)
  assert.equal(body?.email, 'new.user@example.com')

  const created = await User.findOne({ email: 'new.user@example.com' }).lean()
  assert.ok(created)
  assert.equal(created?.name, 'New User')
})

test('POST /api/users/resolve returns existing user identity', async () => {
  await User.create({ id: 'U-SEED-1', name: 'Existing User', email: 'existing@example.com', phone: '1111111111' })

  const { response, body } = await request('/api/users/resolve', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'existing@example.com' })
  })

  assert.equal(response.status, 200)
  assert.equal(body?.isSeedUser, true)
  assert.equal(body?.id, 'U-SEED-1')
})

test('POST /api/bookings then GET /api/bookings/:id persists and returns booking', async () => {
  const bookingPayload = {
    id: 'B-INT-1',
    userId: 'U-1',
    restaurantId: 'R-1',
    date: '2099-12-31',
    time: '08:00 PM',
    bookingStatus: 'Upcoming',
    paymentStatus: 'Pending'
  }

  const createResult = await request('/api/bookings', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(bookingPayload)
  })

  assert.equal(createResult.response.status, 201)
  assert.equal(createResult.body?.id, 'B-INT-1')

  const fetchResult = await request('/api/bookings/B-INT-1')
  assert.equal(fetchResult.response.status, 200)
  assert.equal(fetchResult.body?.id, 'B-INT-1')
  assert.equal(fetchResult.body?.userId, 'U-1')
})

test('POST /api/feedback/submit stores feedback and links booking', async () => {
  await Booking.create({
    id: 'B-FEED-1',
    userId: 'U-OWNER-1',
    restaurantId: 'R-1',
    date: '2020-01-10',
    time: '07:00 PM',
    bookingStatus: 'Completed',
    paymentStatus: 'Paid'
  })

  const submit = await request('/api/feedback/submit', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      bookingId: 'B-FEED-1',
      userId: 'U-OWNER-1',
      restaurantId: 'R-1',
      rating: 5,
      review: 'Great experience'
    })
  })

  assert.equal(submit.response.status, 201)
  assert.equal(submit.body?.bookingId, 'B-FEED-1')

  const updatedBooking = await Booking.findOne({ id: 'B-FEED-1' }).lean()
  assert.equal(updatedBooking?.feedbackSubmitted, true)
  assert.ok(updatedBooking?.feedbackId)
})

test('POST /api/feedback/submit rejects duplicate feedback for same booking', async () => {
  await Booking.create({
    id: 'B-FEED-2',
    userId: 'U-OWNER-2',
    restaurantId: 'R-2',
    date: '2020-02-10',
    time: '08:00 PM',
    bookingStatus: 'Completed',
    paymentStatus: 'Paid'
  })

  await Feedback.create({
    id: 'F-EXISTS-1',
    bookingId: 'B-FEED-2',
    userId: 'U-OWNER-2',
    restaurantId: 'R-2',
    rating: 4,
    review: 'Already submitted'
  })

  const submit = await request('/api/feedback/submit', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      bookingId: 'B-FEED-2',
      userId: 'U-OWNER-2',
      restaurantId: 'R-2',
      rating: 5,
      review: 'Second feedback attempt'
    })
  })

  assert.equal(submit.response.status, 400)
  assert.match(String(submit.body?.message), /feedback already submitted/i)
})

test('POST /api/payments then GET /api/payments?bookingId= returns filtered payment', async () => {
  const upsert = await request('/api/payments', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      id: 'P-INT-1',
      bookingId: 'B-PAY-1',
      userId: 'U-1',
      restaurantId: 'R-1',
      amount: 1234,
      status: 'Pending',
      method: 'Online'
    })
  })

  assert.equal(upsert.response.status, 201)

  const list = await request('/api/payments?bookingId=B-PAY-1')
  assert.equal(list.response.status, 200)
  assert.equal(Array.isArray(list.body), true)
  assert.equal(list.body.length, 1)
  assert.equal(list.body[0]?.id, 'P-INT-1')

  const stored = await Payment.findOne({ id: 'P-INT-1' }).lean()
  assert.equal(stored?.bookingId, 'B-PAY-1')
})
