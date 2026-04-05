import { getHealthSnapshot } from '../services/healthService.js'

// Health controller keeps HTTP response shape isolated from counting logic.
export const getHealth = async (_req, res) => {
  const snapshot = await getHealthSnapshot()
  return res.json(snapshot)
}