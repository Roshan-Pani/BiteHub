import express from 'express'
import { healthRouter } from './healthRoutes.js'
import { restaurantRouter } from './restaurantRoutes.js'
import { userRouter } from './userRoutes.js'
import { bookingRouter } from './bookingRoutes.js'
import { feedbackRouter } from './feedbackRoutes.js'
import { paymentRouter } from './paymentRoutes.js'

// API router composes resource routers and keeps the public API contract stable.
export const apiRouter = express.Router()

apiRouter.use(healthRouter)
apiRouter.use(restaurantRouter)
apiRouter.use(userRouter)
apiRouter.use(bookingRouter)
apiRouter.use(feedbackRouter)
apiRouter.use(paymentRouter)
