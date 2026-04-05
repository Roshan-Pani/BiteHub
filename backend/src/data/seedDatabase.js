import { Booking, Feedback, Payment, Restaurant, User } from '../models/index.js'
import { getSeedData } from './seedSources.js'

const upsertById = async (Model, records) => {
  if (!Array.isArray(records) || records.length === 0) return

  await Model.bulkWrite(
    records.map((record) => ({
      updateOne: {
        filter: { id: record.id },
        update: { $set: record },
        upsert: true
      }
    })),
    { ordered: false }
  )
}

export const seedDatabase = async () => {
  const collections = [Restaurant, User, Booking, Feedback, Payment]
  const [restaurantCount, userCount, bookingCount, feedbackCount, paymentCount] = await Promise.all(
    collections.map((Model) => Model.estimatedDocumentCount())
  )

  if (restaurantCount > 0 && userCount > 0 && bookingCount > 0 && feedbackCount > 0 && paymentCount > 0) {
    return { skipped: true }
  }

  const seed = getSeedData()

  await Promise.all([
    upsertById(Restaurant, seed.restaurants),
    upsertById(User, seed.users),
    upsertById(Booking, seed.bookings),
    upsertById(Feedback, seed.feedback),
    upsertById(Payment, seed.payments)
  ])

  return {
    skipped: false,
    counts: {
      restaurants: seed.restaurants.length,
      users: seed.users.length,
      bookings: seed.bookings.length,
      feedback: seed.feedback.length,
      payments: seed.payments.length
    }
  }
}
