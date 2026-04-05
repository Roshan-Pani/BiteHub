import express from 'express'
import { asyncHandler } from '../middlewares/asyncHandler.js'
import {
  getRestaurant,
  getRestaurantFeedbackStatsController,
  getRestaurantMenuController,
  getRestaurantSeatsController,
  listRestaurants
} from '../controllers/restaurantController.js'

// Restaurant routes stay stable while the implementation moves behind controllers.
export const restaurantRouter = express.Router()

restaurantRouter.get('/restaurants', asyncHandler(listRestaurants))
restaurantRouter.get('/restaurants/:id', asyncHandler(getRestaurant))
restaurantRouter.get('/restaurants/:id/feedback-stats', asyncHandler(getRestaurantFeedbackStatsController))
restaurantRouter.get('/restaurants/:id/menu', asyncHandler(getRestaurantMenuController))
restaurantRouter.get('/restaurants/:id/seats', asyncHandler(getRestaurantSeatsController))