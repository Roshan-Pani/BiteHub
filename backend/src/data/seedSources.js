import { restaurants } from '../../../frontend/src/Data/restaurants.js'
import { users } from '../../../frontend/src/Data/users.js'
import { normalizedSeedBookings } from '../../../frontend/src/Data/bookings.js'
import { normalizedSeedFeedback } from '../../../frontend/src/Data/feedback.js'
import { payments } from '../../../frontend/src/Data/payments.js'
import { getDetailedMenuForRestaurant } from '../../../frontend/src/Data/restaurantMenuCatalog.js'
import { getSeatsForSlot } from '../../../frontend/src/Data/tableunits.js'

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
