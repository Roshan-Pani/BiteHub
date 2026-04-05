import { extractRequestUser } from '../auth/requestUser.js'

// Attach request identity when clients send a mock auth context.
export const attachRequestUser = (req, _res, next) => {
  req.requestUser = extractRequestUser(req)
  next()
}