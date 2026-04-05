import mongoose from 'mongoose'

const options = {
  strict: false,
  versionKey: false,
  timestamps: true
}

const createSchema = () => new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    }
  },
  options
)

const restaurantSchema = createSchema()
restaurantSchema.index({ location: 1 })
restaurantSchema.index({ cuisine: 1 })

const userSchema = createSchema()
userSchema.index({ email: 1 }, { unique: true, sparse: true })

const bookingSchema = createSchema()
bookingSchema.index({ userId: 1 })
bookingSchema.index({ restaurantId: 1 })
bookingSchema.index({ bookingStatus: 1 })
bookingSchema.index({ date: 1 })

const feedbackSchema = createSchema()
feedbackSchema.index({ bookingId: 1 }, { unique: true, sparse: true })
feedbackSchema.index({ restaurantId: 1 })
feedbackSchema.index({ userId: 1 })

const paymentSchema = createSchema()
paymentSchema.index({ bookingId: 1 }, { unique: true, sparse: true })
paymentSchema.index({ userId: 1 })
paymentSchema.index({ status: 1 })

export const Restaurant = mongoose.model('Restaurant', restaurantSchema)
export const User = mongoose.model('User', userSchema)
export const Booking = mongoose.model('Booking', bookingSchema)
export const Feedback = mongoose.model('Feedback', feedbackSchema)
export const Payment = mongoose.model('Payment', paymentSchema)
