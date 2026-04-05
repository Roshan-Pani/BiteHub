import {
  getRestaurantById,
  getRestaurantFeedbackStats,
  getRestaurantList,
  getRestaurantMenu,
  getRestaurantSeats
} from '../services/restaurantService.js'

// Restaurant controller owns HTTP transport and delegates to the service layer.
export const listRestaurants = async (_req, res) => {
  const restaurants = await getRestaurantList()
  return res.json(restaurants)
}

export const getRestaurant = async (req, res) => {
  const restaurant = await getRestaurantById(req.params.id)
  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' })
  }
  return res.json(restaurant)
}

export const getRestaurantFeedbackStatsController = async (req, res) => {
  const stats = await getRestaurantFeedbackStats(req.params.id)
  if (!stats) {
    return res.status(404).json({ message: 'Restaurant not found' })
  }
  return res.json(stats)
}

export const getRestaurantMenuController = async (req, res) => {
  const restaurant = await getRestaurantById(req.params.id)
  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' })
  }

  const menu = await getRestaurantMenu(restaurant)
  return res.json(menu)
}

export const getRestaurantSeatsController = async (req, res) => {
  const { date = '', time = '' } = req.query
  const seats = await getRestaurantSeats({
    restaurantId: req.params.id,
    date: String(date),
    time: String(time)
  })
  return res.json(seats)
}