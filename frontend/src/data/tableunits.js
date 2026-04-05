import { restaurants } from './restaurants.js'
import { normalizedSeedBookings } from './bookings.js'

// Individual seat inventory for all restaurants. Each seat represents one
// physical chair that can be individually booked. Seats are grouped by type
// (e.g., "Booth", "Standard Table") with 15-20 seats per type per restaurant.
// This creates a visual seat-map experience similar to cinema or airline booking.
//
// Each seat record: { id: "S1-Booth-001", restaurantId: "R1", type: "Booth", status: "Available" }

const fallbackTableTypes = [
  'Booth',
  'Standard Table',
  'Outdoor Seating',
  'Rooftop',
  'Private Dining',
  'Family Table',
  'Bar Counter',
  'Window Table'
]

const getHourFromTimeInput = (timeValue) => {
  if (!timeValue || !timeValue.includes(':')) return null
  const [hours] = timeValue.split(':').map(Number)
  return Number.isNaN(hours) ? null : hours
}

const createDeterministicHash = (value) => {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

const getAvailabilityThreshold = (dateValue, hour) => {
  const defaultThreshold = 24
  if (!dateValue || typeof hour !== 'number') return defaultThreshold

  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return defaultThreshold

  const day = date.getDay()
  const isWeekend = day === 0 || day === 6
  const isLunchPeak = hour >= 12 && hour <= 14
  const isDinnerPeak = hour >= 19 && hour <= 22

  if (isDinnerPeak) return isWeekend ? 58 : 48
  if (isLunchPeak) return isWeekend ? 46 : 36
  return isWeekend ? 30 : defaultThreshold
}

const RUNTIME_BOOKINGS_KEY = 'ctx-runtime-bookings'

const safeParse = (value, fallback) => {
  try {
    const parsed = JSON.parse(value)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

const isExpired = (expiresAt) => {
  if (!expiresAt) return false
  const time = new Date(expiresAt).getTime()
  if (Number.isNaN(time)) return false
  return Date.now() > time
}

const loadRuntimeBookings = () => {
  if (typeof window === 'undefined' || !window.localStorage) return []

  const raw = window.localStorage.getItem(RUNTIME_BOOKINGS_KEY)
  if (!raw) return []

  const parsed = safeParse(raw, [])
  if (!Array.isArray(parsed)) return []

  return parsed.filter((record) => !isExpired(record?.expiresAt))
}

const isBookingActive = (booking) => {
  const status = String(booking?.bookingStatus || '').toLowerCase()
  return status !== 'cancelled'
}

const normalizeSeatIdsFromBooking = (booking) => {
  const seatIds = booking?.selectedSeatIds || booking?.bookingDetails?.selectedTableIds || booking?.bookingDetails?.selectedSeats?.map((seat) => seat.id) || booking?.seatNumbers || []
  return Array.isArray(seatIds) ? seatIds.map((seatId) => String(seatId)) : []
}

const getBookedSeatMapForSlot = ({ restaurantId, date, time }) => {
  const bookings = [
    ...normalizedSeedBookings,
    ...loadRuntimeBookings()
  ]

  const bookedSeats = new Set()

  bookings.forEach((booking) => {
    if (!isBookingActive(booking)) return
    if (booking.restaurantId !== restaurantId) return
    if (booking.date !== date) return
    if (booking.time !== time) return

    normalizeSeatIdsFromBooking(booking).forEach((seatId) => bookedSeats.add(seatId))
  })

  return { bookedSeats }
}

// Generate individual seats for each restaurant.
// Each restaurant gets 2-4 seat types, with 15-20 seats per type.
// This gives 30-80 individual bookable seats per restaurant.
const generateSeatsForRestaurant = (restaurant) => {
  const restaurantIndex = Number(restaurant.id.substring(1))
  
  // Pick 2-4 seat types for this restaurant
  const typeCount = 2 + (restaurantIndex % 3)
  const selectedTypes = []
  for (let i = 0; i < typeCount; i += 1) {
    const type = fallbackTableTypes[(restaurantIndex + i) % fallbackTableTypes.length]
    if (!selectedTypes.includes(type)) {
      selectedTypes.push(type)
    }
  }

  // Generate 15-20 seats per type
  const seats = []
  selectedTypes.forEach((type) => {
    const seatCount = 15 + (restaurantIndex % 6) // 15-20 seats per type
    for (let seatNum = 1; seatNum <= seatCount; seatNum += 1) {
      const seatId = `S${restaurantIndex}-${type}-${String(seatNum).padStart(3, '0')}`
      
      // Deterministic initial status: most available, some reserved
      const statusHash = createDeterministicHash(`${seatId}|init`) % 100
      const initialStatus = statusHash < 75 ? 'Available' : 'Reserved'

      seats.push({
        id: seatId,
        restaurantId: restaurant.id,
        type,
        status: initialStatus
      })
    }
  })

  return seats
}

// Generate all seats for all restaurants
const allSeats = restaurants.flatMap((restaurant) => generateSeatsForRestaurant(restaurant))

// Returns seat inventory for a specific date/time slot with deterministic
// status adjustments. This keeps demo data realistic while staying stable for
// the same slot input during a session.
export const getSeatsForSlot = ({ restaurantId, date, time }) => {
  const seats = allSeats.filter((seat) => seat.restaurantId === restaurantId)
  const hour = getHourFromTimeInput(time)
  const reservationThreshold = getAvailabilityThreshold(date, hour)
  const { bookedSeats } = getBookedSeatMapForSlot({ restaurantId, date, time })

  if (!date || !time) return seats

  return seats.map((seat) => {
    if (bookedSeats.has(seat.id)) {
      return { ...seat, status: 'Reserved' }
    }

    if (seat.status !== 'Available') return seat

    const score = createDeterministicHash(`${seat.id}|${date}|${time}`) % 100

    if (score < reservationThreshold) {
      return { ...seat, status: 'Reserved' }
    }

    return seat
  })
}

// Static reference to all generated seats (used before slot filtering)
export const tableUnits = allSeats

// Legacy function for backward compatibility with slot-aware table fetching
export const getTableUnitsForSlot = ({ restaurantId, date, time }) => {
  return getSeatsForSlot({ restaurantId, date, time })
}


// (Seed table units removed: now using dynamic seat generation)
