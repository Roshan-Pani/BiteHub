export const parseMeridianTime = (value) => {
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

export const toDateTime = (date, time) => {
  if (!date || !time) return null
  const parsed = parseMeridianTime(time)
  if (!parsed) return null

  const dt = new Date(`${date}T00:00:00`)
  if (Number.isNaN(dt.getTime())) return null
  dt.setHours(parsed.hours, parsed.minutes, 0, 0)
  return dt
}

export const normalizePaymentStatus = (status) => {
  const safe = String(status || '').toLowerCase()
  if (safe === 'completed' || safe === 'paid' || safe === 'success') return 'Paid'
  if (safe === 'pay at restaurant' || safe === 'cash' || safe === 'restaurant') return 'Pay at Restaurant'
  if (safe === 'cancelled' || safe === 'failed') return 'Cancelled'
  return 'Pending'
}

export const countWords = (text) => {
  const safe = (text || '').trim()
  if (!safe) return 0
  return safe.split(/\s+/).length
}

export const evaluateFeedbackGate = ({ booking, userId, nowMs = Date.now(), hasExistingFeedback = false }) => {
  if (!booking) return { allowed: false, reason: 'Booking not found.' }
  if (!userId || booking.userId !== userId) {
    return { allowed: false, reason: 'You can submit feedback only for your own booking.' }
  }
  if (booking.bookingStatus !== 'Completed') {
    return { allowed: false, reason: 'Feedback is allowed only for completed bookings.' }
  }

  const bookingTime = toDateTime(booking.date, booking.time)
  if (bookingTime && bookingTime.getTime() > nowMs) {
    return { allowed: false, reason: 'Feedback is available after your dining time has passed.' }
  }

  if (hasExistingFeedback) {
    return { allowed: false, reason: 'Feedback already submitted for this booking.' }
  }

  return { allowed: true, reason: '' }
}
