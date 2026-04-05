import { listPayments, upsertPaymentById } from '../repositories/paymentRepository.js'

// Payment service keeps payment reads and writes out of controllers.
export const getPaymentList = ({ bookingId, userId, restaurantId, status, limit } = {}) => {
  const filter = {}
  if (bookingId) filter.bookingId = String(bookingId)
  if (userId) filter.userId = String(userId)
  if (restaurantId) filter.restaurantId = String(restaurantId)
  if (status) filter.status = String(status)

  return listPayments(filter, limit)
}

export const upsertPaymentRecord = (payload) => {
  if (!payload.id) {
    return Promise.resolve({ ok: false, status: 400, message: 'Payment id is required' })
  }

  return upsertPaymentById(payload).then((payment) => ({ ok: true, status: 201, data: payment }))
}