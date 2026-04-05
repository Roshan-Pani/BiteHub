import express from 'express'
import { listUsers, resolveIdentity } from '../controllers/userController.js'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import { requireBodyFields } from '../middlewares/validateRequest.js'

// User routes preserve the identity bridge used by the frontend login flow.
export const userRouter = express.Router()

userRouter.get('/users', asyncHandler(listUsers))
userRouter.post('/users/resolve', requireBodyFields(['email']), asyncHandler(resolveIdentity))