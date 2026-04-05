import { getMenuForRestaurant, getSeatsBySlot } from '../data/seedSources.js'
import {
  findRestaurantById,
  listRestaurants
} from '../repositories/restaurantRepository.js'
import {
  findFeedbackByBookingId,
  listFeedback
} from '../repositories/feedbackRepository.js'
import { listUsers } from '../repositories/userRepository.js'

// Restaurant service handles read-model orchestration for public restaurant data.
export const getRestaurantList = () => listRestaurants()

export const getRestaurantById = async (id) => findRestaurantById(id)

export const getRestaurantMenu = async (restaurant) => getMenuForRestaurant(restaurant)

export const getRestaurantSeats = async ({ restaurantId, date, time }) => getSeatsBySlot({ restaurantId, date, time })

export const getRestaurantFeedbackStats = async (restaurantId) => {
  const [restaurant, feedbackRows, users] = await Promise.all([
    findRestaurantById(restaurantId),
    listFeedback({ restaurantId }),
    listUsers()
  ])

  if (!restaurant) return null

  const userMap = new Map(users.map((user) => [user.id, user]))
  const allReviews = feedbackRows
    .map((row) => ({
      ...row,
      reviewerName: userMap.get(row.userId)?.name || 'Guest User'
    }))
    .sort((a, b) => new Date(b.submittedAt || b.createdAt || 0).getTime() - new Date(a.submittedAt || a.createdAt || 0).getTime())

  const reviewCount = allReviews.length
  const averageRating = reviewCount > 0
    ? allReviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviewCount
    : 0

  return {
    reviewCount,
    averageRating,
    allReviews,
    recentReviews: allReviews.slice(0, 6)
  }
}

export const hasRestaurantFeedback = async (bookingId) => {
  return Boolean(await findFeedbackByBookingId(bookingId))
}