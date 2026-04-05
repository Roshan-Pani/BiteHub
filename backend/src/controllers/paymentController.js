import { getPaymentList, upsertPaymentRecord } from '../services/paymentService.js'
import { sendServiceResult } from '../utils/serviceResult.js'

// Payment controller keeps payment payloads out of the HTTP router.
export const listPayments = async (req, res) => {
  const payments = await getPaymentList(req.query)
  return res.json(payments)
}

export const upsertPayment = async (req, res) => {
  const result = await upsertPaymentRecord(req.body || {})
  return sendServiceResult(res, result)
}