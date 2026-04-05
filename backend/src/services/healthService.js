import {
  countRestaurants
} from '../repositories/restaurantRepository.js'
import {
  countUsers
} from '../repositories/userRepository.js'
import {
  countBookings
} from '../repositories/bookingRepository.js'
import {
  countFeedback
} from '../repositories/feedbackRepository.js'
import {
  countPayments
} from '../repositories/paymentRepository.js'

// Health service keeps collection counting away from the HTTP layer.
export const getHealthSnapshot = async () => {
  const [restaurants, users, bookings, feedback, payments] = await Promise.all([
    countRestaurants(),
    countUsers(),
    countBookings(),
    countFeedback(),
    countPayments()
  ])

  return {
    status: 'ok',
    collections: { restaurants, users, bookings, feedback, payments }
  }
}