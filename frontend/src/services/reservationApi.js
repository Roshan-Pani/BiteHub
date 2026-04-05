import { fetchJson } from './apiClient'

export const getUsers = () => fetchJson('/users')
export const getBookings = () => fetchJson('/bookings')
export const getFeedback = () => fetchJson('/feedback')
export const getPayments = () => fetchJson('/payments')

export const getBookingByIdFromApi = (bookingId) => fetchJson(`/bookings/${bookingId}`)

export const getBookingsForUserFromApi = (userId) => fetchJson(`/bookings/user/${userId}`)

export const getCancellationPolicy = (bookingId) => fetchJson(`/bookings/${bookingId}/cancellation-policy`)

export const cancelBooking = (bookingId) => {
  return fetchJson(`/bookings/${bookingId}/cancel`, {
    method: 'POST'
  })
}

export const autoCancelExpiredBookingsFromApi = () => {
  return fetchJson('/bookings/auto-cancel', {
    method: 'POST'
  })
}

export const getFeedbackEligibility = ({ bookingId, userId }) => {
  const params = new URLSearchParams({ userId })
  return fetchJson(`/feedback/eligibility/${bookingId}?${params.toString()}`)
}

export const submitFeedback = (payload) => {
  return fetchJson('/feedback/submit', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export const resolveUserIdentityFromApi = (payload) => {
  return fetchJson('/users/resolve', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export const getRestaurantFeedbackStats = (restaurantId) => fetchJson(`/restaurants/${restaurantId}/feedback-stats`)

export const upsertBooking = (booking) => {
  return fetchJson('/bookings', {
    method: 'POST',
    body: JSON.stringify(booking)
  })
}

export const upsertFeedback = (feedback) => {
  return fetchJson('/feedback', {
    method: 'POST',
    body: JSON.stringify(feedback)
  })
}

export const upsertPayment = (payment) => {
  return fetchJson('/payments', {
    method: 'POST',
    body: JSON.stringify(payment)
  })
}
