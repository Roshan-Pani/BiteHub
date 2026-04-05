import mongoose from 'mongoose'

const { Schema } = mongoose

const schemaOptions = {
  strict: true,
  versionKey: false,
  timestamps: true
}

const createNestedSchema = (definition) => new Schema(definition, { _id: false })

const sharedIdSchema = {
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  }
}

const restaurantLocationSchema = createNestedSchema({
  country: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  pin: { type: String, required: true },
  specialIdentification: { type: String, required: true }
})

const restaurantCuisineSchema = createNestedSchema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  cuisinePicture: { type: String, required: true }
})

const restaurantLocationSnapshotSchema = createNestedSchema({
  country: { type: String, default: '' },
  state: { type: String, default: '' },
  district: { type: String, default: '' },
  city: { type: String, default: '' },
  pin: { type: String, default: '' },
  specialIdentification: { type: String, default: '' }
})

const restaurantCuisineSnapshotSchema = createNestedSchema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  cuisinePicture: { type: String, default: '' }
})

const restaurantTableDescriptionSchema = createNestedSchema({
  tableTypesAvailable: { type: [String], default: [] },
  seatsPerTable: { type: [Number], default: [] }
})

const restaurantSchema = new Schema(
  {
    ...sharedIdSchema,
    name: { type: String, required: true, trim: true },
    location: { type: restaurantLocationSchema, required: true },
    cuisine: { type: restaurantCuisineSchema, required: true },
    isVegOnly: { type: Boolean, default: false },
    hasAC: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    tabledescription: { type: restaurantTableDescriptionSchema, default: () => ({}) },
    menu: { type: [String], default: [] },
    openingTime: { type: String, default: '' },
    closingTime: { type: String, default: '' },
    offDays: { type: [String], default: [] },
    mealTypes: { type: [String], default: [] },
    serviceDays: { type: [String], default: [] },
    unavailableDates: { type: [String], default: [] },
    specialMessages: { type: String, default: '' },
    source: { type: String, default: 'seed' }
  },
  schemaOptions
)

restaurantSchema.index({ 'location.city': 1 })
restaurantSchema.index({ 'location.district': 1 })
restaurantSchema.index({ 'cuisine.name': 1 })
restaurantSchema.index({ rating: -1 })

const userSchema = new Schema(
  {
    ...sharedIdSchema,
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    isAuthenticated: { type: Boolean, default: false },
    source: { type: String, default: 'seed' }
  },
  schemaOptions
)

userSchema.index({ email: 1 }, { unique: true, sparse: true })

const guestSchema = createNestedSchema({
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  age: { type: Number, default: null },
  sex: { type: String, default: '' },
  foodPreference: { type: String, default: '' },
  isInfant: { type: Boolean, default: false }
})

const seatSchema = createNestedSchema({
  id: { type: String, required: true },
  type: { type: String, default: '' },
  status: { type: String, default: '' }
})

const bookingDetailsSchema = createNestedSchema({
  date: { type: String, default: '' },
  time: { type: String, default: '' },
  guests: { type: [guestSchema], default: [] },
  selectedTableIds: { type: [String], default: [] },
  selectedSeats: { type: [seatSchema], default: [] }
})

const pricingSchema = createNestedSchema({
  bookingBase: { type: Number, default: 0 },
  costPerSeat: { type: Number, default: 0 },
  selectedSeatCount: { type: Number, default: 0 },
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
})

const timelineEntrySchema = createNestedSchema({
  type: { type: String, default: '' },
  status: { type: String, default: '' },
  at: { type: Date, default: null },
  note: { type: String, default: '' }
})

const cancellationSchema = createNestedSchema({
  attemptedAt: { type: Date, default: null },
  allowed: { type: Boolean, default: false },
  reason: { type: String, default: '' }
})

const bookingRestaurantSnapshotSchema = createNestedSchema({
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  location: { type: restaurantLocationSnapshotSchema, default: () => ({}) },
  cuisine: { type: restaurantCuisineSnapshotSchema, default: () => ({}) },
  isVegOnly: { type: Boolean, default: false },
  hasAC: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  images: { type: [String], default: [] },
  tabledescription: { type: restaurantTableDescriptionSchema, default: () => ({}) },
  openingTime: { type: String, default: '' },
  closingTime: { type: String, default: '' },
  offDays: { type: [String], default: [] },
  mealTypes: { type: [String], default: [] },
  serviceDays: { type: [String], default: [] },
  unavailableDates: { type: [String], default: [] },
  specialMessages: { type: String, default: '' }
})

const createdBySchema = createNestedSchema({
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  email: { type: String, default: '' }
})

const bookingSchema = new Schema(
  {
    ...sharedIdSchema,
    userId: { type: String, required: true },
    restaurantId: { type: String, required: true },
    restaurant: { type: bookingRestaurantSnapshotSchema, default: () => ({}) },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: [guestSchema], default: [] },
    selectedTables: { type: [String], default: [] },
    specialRequests: { type: String, default: '' },
    paymentMethod: { type: String, default: '' },
    paymentStatus: { type: String, default: '' },
    bookingStatus: { type: String, default: '' },
    selectedSeatIds: { type: [String], default: [] },
    seatNumbers: { type: [String], default: [] },
    bookingDetails: { type: bookingDetailsSchema, default: () => ({}) },
    pricing: { type: pricingSchema, default: () => ({}) },
    source: { type: String, default: 'seed' },
    attended: { type: Schema.Types.Mixed, default: null },
    statusTimeline: { type: [timelineEntrySchema], default: [] },
    feedbackSubmitted: { type: Boolean, default: false },
    feedbackId: { type: String, default: '' },
    cancellation: { type: cancellationSchema, default: () => ({}) },
    createdBy: { type: createdBySchema, default: () => ({}) }
  },
  schemaOptions
)

bookingSchema.index({ bookingStatus: 1 })
bookingSchema.index({ userId: 1, date: -1 })
bookingSchema.index({ restaurantId: 1, date: -1 })

const feedbackSchema = new Schema(
  {
    ...sharedIdSchema,
    bookingId: { type: String, required: true },
    userId: { type: String, required: true },
    restaurantId: { type: String, required: true },
    rating: { type: Number, required: true },
    review: { type: String, default: '' },
    serviceRating: { type: Number, default: 0 },
    foodRating: { type: Number, default: 0 },
    ambianceRating: { type: Number, default: 0 },
    submittedAt: { type: Date, default: null },
    source: { type: String, default: 'seed' }
  },
  schemaOptions
)

feedbackSchema.index({ bookingId: 1 }, { unique: true, sparse: true })
feedbackSchema.index({ restaurantId: 1 })
feedbackSchema.index({ userId: 1 })

const paymentMetaSchema = createNestedSchema({
  date: { type: String, default: '' },
  time: { type: String, default: '' },
  seatCount: { type: Number, default: 0 },
  paidAt: { type: Date, default: null }
})

const paymentSchema = new Schema(
  {
    ...sharedIdSchema,
    bookingId: { type: String, required: true },
    userId: { type: String, default: '' },
    restaurantId: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    method: { type: String, default: '' },
    status: { type: String, default: '' },
    meta: { type: paymentMetaSchema, default: () => ({}) },
    source: { type: String, default: 'seed' }
  },
  schemaOptions
)

paymentSchema.index({ bookingId: 1 }, { unique: true, sparse: true })
paymentSchema.index({ userId: 1 })
paymentSchema.index({ status: 1 })

export const Restaurant = mongoose.model('Restaurant', restaurantSchema)
export const User = mongoose.model('User', userSchema)
export const Booking = mongoose.model('Booking', bookingSchema)
export const Feedback = mongoose.model('Feedback', feedbackSchema)
export const Payment = mongoose.model('Payment', paymentSchema)
