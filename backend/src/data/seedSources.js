import { restaurants } from './restaurants.js'
import { users } from './users.js'
import { normalizedSeedBookings } from './bookings.js'
import { normalizedSeedFeedback } from './feedback.js'
import { payments } from './payments.js'
import { getDetailedMenuForRestaurant } from './restaurantMenuCatalog.js'
import { getSeatsForSlot } from './tableunits.js'

export const getSeedData = () => ({
  restaurants,
  users,
  bookings: normalizedSeedBookings,
  feedback: normalizedSeedFeedback,
  payments
})

export const getMenuForRestaurant = (restaurant) => getDetailedMenuForRestaurant(restaurant)

export const getSeatsBySlot = ({ restaurantId, date, time }) => {
  return getSeatsForSlot({ restaurantId, date, time })
}
