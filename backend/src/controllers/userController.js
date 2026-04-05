import {
  getUserList,
  resolveUserIdentity
} from '../services/userService.js'
import { sendServiceResult } from '../utils/serviceResult.js'

// User controller exposes the identity bridge used by the frontend.
export const listUsers = async (_req, res) => {
  const users = await getUserList()
  return res.json(users)
}

export const resolveIdentity = async (req, res) => {
  const result = await resolveUserIdentity(req.body || {})
  return sendServiceResult(res, result)
}