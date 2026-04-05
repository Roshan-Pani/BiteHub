import { Payment } from '../models/index.js'

// Payment repository centralizes payment persistence and query operations.
export const countPayments = () => Payment.estimatedDocumentCount()

export const listPayments = (filter = {}, limit) => {
  const query = Payment.find(filter)
  const parsedLimit = Number(limit)

  if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
    query.limit(parsedLimit)
  }

  return query.lean()
}

export const upsertPaymentById = (payment) => Payment.findOneAndUpdate(
  { id: payment.id },
  { $set: payment },
  { upsert: true, new: true, runValidators: true, context: 'query' }
).lean()