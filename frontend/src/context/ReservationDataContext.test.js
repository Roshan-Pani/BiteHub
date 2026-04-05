import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizePaymentStatus, evaluateFeedbackGate, toDateTime } from './reservationDataRules.js'

test('booking to payment status normalization is consistent', () => {
  assert.equal(normalizePaymentStatus('pending'), 'Pending')
  assert.equal(normalizePaymentStatus('Pending'), 'Pending')
  assert.equal(normalizePaymentStatus('completed'), 'Paid')
  assert.equal(normalizePaymentStatus('paid'), 'Paid')
  assert.equal(normalizePaymentStatus('success'), 'Paid')
  assert.equal(normalizePaymentStatus('pay at restaurant'), 'Pay at Restaurant')
  assert.equal(normalizePaymentStatus('restaurant'), 'Pay at Restaurant')
  assert.equal(normalizePaymentStatus('failed'), 'Cancelled')
})

test('feedback gate allows completed owner booking without prior feedback', () => {
  const gate = evaluateFeedbackGate({
    booking: {
      id: 'B-ok',
      userId: 'U1',
      bookingStatus: 'Completed',
      date: '2025-01-01',
      time: '7:00 PM'
    },
    userId: 'U1',
    hasExistingFeedback: false,
    nowMs: Date.parse('2026-01-01T00:00:00.000Z')
  })

  assert.equal(gate.allowed, true)
  assert.equal(gate.reason, '')
})

test('feedback gate blocks non-owner, non-completed, future-time and duplicate cases', () => {
  const ownerMismatch = evaluateFeedbackGate({
    booking: {
      id: 'B-owner',
      userId: 'U1',
      bookingStatus: 'Completed',
      date: '2025-01-01',
      time: '7:00 PM'
    },
    userId: 'U2',
    hasExistingFeedback: false,
    nowMs: Date.parse('2026-01-01T00:00:00.000Z')
  })
  assert.equal(ownerMismatch.allowed, false)

  const notCompleted = evaluateFeedbackGate({
    booking: {
      id: 'B-upcoming',
      userId: 'U1',
      bookingStatus: 'Upcoming',
      date: '2026-01-03',
      time: '7:00 PM'
    },
    userId: 'U1',
    hasExistingFeedback: false,
    nowMs: Date.parse('2026-01-01T00:00:00.000Z')
  })
  assert.equal(notCompleted.allowed, false)

  const futureTime = evaluateFeedbackGate({
    booking: {
      id: 'B-future',
      userId: 'U1',
      bookingStatus: 'Completed',
      date: '2026-01-05',
      time: '7:00 PM'
    },
    userId: 'U1',
    hasExistingFeedback: false,
    nowMs: Date.parse('2026-01-01T00:00:00.000Z')
  })
  assert.equal(futureTime.allowed, false)

  const duplicate = evaluateFeedbackGate({
    booking: {
      id: 'B-dup',
      userId: 'U1',
      bookingStatus: 'Completed',
      date: '2025-01-01',
      time: '7:00 PM'
    },
    userId: 'U1',
    hasExistingFeedback: true,
    nowMs: Date.parse('2026-01-01T00:00:00.000Z')
  })
  assert.equal(duplicate.allowed, false)
})

test('time parser supports both meridian and 24-hour values', () => {
  const meridian = toDateTime('2026-03-01', '7:30 PM')
  const military = toDateTime('2026-03-01', '19:30')

  assert.equal(meridian?.getHours(), 19)
  assert.equal(military?.getHours(), 19)
})
