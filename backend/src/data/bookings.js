// Booking records are the bridge between users, restaurants, tables, and payments.
// Each item represents a completed or upcoming reservation with guest details,
// selected table IDs, payment state, and the booking lifecycle status.
// The dataset is intentionally varied so pages can show history, payment status,
// family/group bookings, and special request handling.

import { normalizePaymentStatus } from '../../../shared/bookingRules.js'

/**
 * Helper to generate dates relative to today
 * @param {number} daysOffset - Days from today (negative = past, positive = future)
 * @returns {string} - ISO date string (YYYY-MM-DD)
 */
const getDateOffset = (daysOffset) => {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)
  return date.toISOString().split('T')[0]
}

export const bookings = [
  // Past/Completed bookings (3-30 days ago)
  { id: "B1", userId: "U1", restaurantId: "R1", date: getDateOffset(-10), time: "7:30 PM", guests: [{ name: "Roshan", age: 22, sex: "Male", foodPreference: "Veg", isInfant: false }], selectedTables: ["T1"], specialRequests: "Window seating", paymentMethod: "Card", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B2", userId: "U1", restaurantId: "R8", date: getDateOffset(-5), time: "8:00 PM", guests: [{ name: "Roshan", age: 22, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Priya", age: 24, sex: "Female", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T8"], specialRequests: "Anniversary celebration", paymentMethod: "UPI", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B3", userId: "U4", restaurantId: "R5", date: getDateOffset(-20), time: "7:00 PM", guests: [{ name: "Priya", age: 24, sex: "Female", foodPreference: "Veg", isInfant: false }, { name: "Amit", age: 26, sex: "Male", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T5"], specialRequests: "Birthday cake arrangement", paymentMethod: "Card", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B4", userId: "U5", restaurantId: "R13", date: getDateOffset(-25), time: "1:00 PM", guests: [{ name: "Amit", age: 26, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Sneha", age: 25, sex: "Female", foodPreference: "Non-Veg", isInfant: false }, { name: "Ravi", age: 27, sex: "Male", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T13"], specialRequests: "Extra spicy biryani", paymentMethod: "Cash", paymentStatus: "Paid", bookingStatus: "Completed" },
  // Future/Upcoming bookings (5-30 days from now)
  { id: "B5", userId: "U7", restaurantId: "R42", date: getDateOffset(15), time: "8:30 PM", guests: [{ name: "Sneha", age: 25, sex: "Female", foodPreference: "Non-Veg", isInfant: false }, { name: "Rahul", age: 28, sex: "Male", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T42"], specialRequests: "Valentine's special setup", paymentMethod: "Card", paymentStatus: "Paid", bookingStatus: "Upcoming" },
  { id: "B6", userId: "U8", restaurantId: "R6", date: getDateOffset(-30), time: "6:30 PM", guests: [{ name: "Deepak", age: 30, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Anita", age: 29, sex: "Female", foodPreference: "Non-Veg", isInfant: false }, { name: "Baby", age: 2, sex: "Male", foodPreference: "Veg", isInfant: true }], selectedTables: ["T6"], specialRequests: "High chair for infant", paymentMethod: "UPI", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B7", userId: "U10", restaurantId: "R21", date: getDateOffset(-15), time: "12:30 PM", guests: [{ name: "Kavita", age: 23, sex: "Female", foodPreference: "Veg", isInfant: false }, { name: "Meera", age: 24, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T21"], specialRequests: "Traditional Sadya service", paymentMethod: "Card", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B8", userId: "U11", restaurantId: "R4", date: getDateOffset(-3), time: "7:00 PM", guests: [{ name: "Vikram", age: 32, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Sonia", age: 30, sex: "Female", foodPreference: "Veg", isInfant: false }, { name: "Arjun", age: 35, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Neha", age: 28, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T4"], specialRequests: "Rooftop seating", paymentMethod: "Card", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B9", userId: "U13", restaurantId: "R15", date: getDateOffset(-60), time: "9:00 AM", guests: [{ name: "Manish", age: 27, sex: "Male", foodPreference: "Veg", isInfant: false }], selectedTables: ["T15"], specialRequests: "Filter coffee with breakfast", paymentMethod: "UPI", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B10", userId: "U14", restaurantId: "R38", date: getDateOffset(-8), time: "8:00 PM", guests: [{ name: "Pooja", age: 26, sex: "Female", foodPreference: "Non-Veg", isInfant: false }, { name: "Karan", age: 28, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Simran", age: 25, sex: "Female", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T38"], specialRequests: "BBQ table seating", paymentMethod: "Card", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B11", userId: "U16", restaurantId: "R30", date: getDateOffset(8), time: "1:00 PM", guests: [{ name: "Rajesh", age: 34, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Shweta", age: 31, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T30"], specialRequests: "Dim sum cart service", paymentMethod: "Wallet", paymentStatus: "Paid", bookingStatus: "Upcoming" },
  { id: "B12", userId: "U17", restaurantId: "R2", date: getDateOffset(-12), time: "7:30 PM", guests: [{ name: "Aditya", age: 29, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Ritika", age: 27, sex: "Female", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T2"], specialRequests: "Private dining booth", paymentMethod: "Card", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B13", userId: "U19", restaurantId: "R50", date: getDateOffset(-70), time: "6:00 PM", guests: [{ name: "Suresh", age: 45, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Lakshmi", age: 42, sex: "Female", foodPreference: "Veg", isInfant: false }, { name: "Rohit", age: 18, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Priti", age: 16, sex: "Female", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T50"], specialRequests: "Beach seating at sunset", paymentMethod: "UPI", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B14", userId: "U20", restaurantId: "R11", date: getDateOffset(-7), time: "12:00 PM", guests: [{ name: "Divya", age: 24, sex: "Female", foodPreference: "Veg", isInfant: false }, { name: "Tanvi", age: 23, sex: "Female", foodPreference: "Veg", isInfant: false }, { name: "Anjali", age: 25, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T11"], specialRequests: "Royal Thali experience", paymentMethod: "Card", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B15", userId: "U22", restaurantId: "R19", date: getDateOffset(22), time: "7:00 PM", guests: [{ name: "Nikhil", age: 30, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Isha", age: 28, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T19"], specialRequests: "Rooftop seating", paymentMethod: "UPI", paymentStatus: "Paid", bookingStatus: "Upcoming" },
  { id: "B16", userId: "U23", restaurantId: "R34", date: getDateOffset(-11), time: "8:00 PM", guests: [{ name: "Sanjay", age: 38, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Geeta", age: 36, sex: "Female", foodPreference: "Veg", isInfant: false }, { name: "Alok", age: 40, sex: "Male", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T34"], specialRequests: "Weekend Haleem special", paymentMethod: "Card", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B17", userId: "U24", restaurantId: "R26", date: getDateOffset(-18), time: "1:30 PM", guests: [{ name: "Ritu", age: 27, sex: "Female", foodPreference: "Non-Veg", isInfant: false }, { name: "Gaurav", age: 29, sex: "Male", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T26"], specialRequests: "Fresh fish recommendation", paymentMethod: "Cash", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B18", userId: "U1", restaurantId: "R9", date: getDateOffset(-50), time: "7:30 PM", guests: [{ name: "Roshan", age: 22, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Friends Group", age: 23, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Friend2", age: 22, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T9"], specialRequests: "Unlimited buffet", paymentMethod: "UPI", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B19", userId: "U4", restaurantId: "R17", date: getDateOffset(5), time: "6:00 PM", guests: [{ name: "Priya", age: 24, sex: "Female", foodPreference: "Veg", isInfant: false }, { name: "Sara", age: 24, sex: "Female", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T17"], specialRequests: "Booth seating", paymentMethod: "Card", paymentStatus: "Paid", bookingStatus: "Upcoming" },
  { id: "B20", userId: "U5", restaurantId: "R32", date: getDateOffset(-40), time: "8:00 PM", guests: [{ name: "Amit", age: 26, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Team", age: 27, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Member", age: 28, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T32"], specialRequests: "Business dinner", paymentMethod: "Card", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B21", userId: "U7", restaurantId: "R12", date: getDateOffset(-14), time: "7:00 PM", guests: [{ name: "Sneha", age: 25, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T12"], specialRequests: "Thai curry recommendations", paymentMethod: "UPI", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B22", userId: "U8", restaurantId: "R46", date: getDateOffset(12), time: "8:30 PM", guests: [{ name: "Deepak", age: 30, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Anita", age: 29, sex: "Female", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T46"], specialRequests: "Royal dining experience", paymentMethod: "Card", paymentStatus: "Pending", bookingStatus: "Upcoming" },
  { id: "B23", userId: "U10", restaurantId: "R3", date: getDateOffset(-80), time: "12:00 PM", guests: [{ name: "Kavita", age: 23, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T3"], specialRequests: "Organic menu items", paymentMethod: "UPI", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B24", userId: "U11", restaurantId: "R7", date: getDateOffset(-17), time: "7:00 PM", guests: [{ name: "Vikram", age: 32, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Sonia", age: 30, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T7"], specialRequests: "Taco Tuesday special", paymentMethod: "Card", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B25", userId: "U13", restaurantId: "R41", date: getDateOffset(-9), time: "1:00 PM", guests: [{ name: "Manish", age: 27, sex: "Male", foodPreference: "Veg", isInfant: false }, { name: "Rajiv", age: 28, sex: "Male", foodPreference: "Veg", isInfant: false }], selectedTables: ["T41"], specialRequests: "Unlimited thali service", paymentMethod: "Wallet", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B26", userId: "U14", restaurantId: "R22", date: getDateOffset(-13), time: "6:30 PM", guests: [{ name: "Pooja", age: 26, sex: "Female", foodPreference: "Veg", isInfant: false }, { name: "Karan", age: 28, sex: "Male", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T22"], specialRequests: "Half-half pizza", paymentMethod: "UPI", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B27", userId: "U16", restaurantId: "R14", date: getDateOffset(-65), time: "10:00 AM", guests: [{ name: "Rajesh", age: 34, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Shweta", age: 31, sex: "Female", foodPreference: "Veg", isInfant: false }, { name: "Kids", age: 8, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T14"], specialRequests: "Sunday brunch special", paymentMethod: "Card", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B28", userId: "U17", restaurantId: "R44", date: getDateOffset(18), time: "7:30 PM", guests: [{ name: "Aditya", age: 29, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Ritika", age: 27, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T44"], specialRequests: "Mezze platter", paymentMethod: "Card", paymentStatus: "Pending", bookingStatus: "Upcoming" },
  { id: "B29", userId: "U19", restaurantId: "R18", date: getDateOffset(-75), time: "8:00 AM", guests: [{ name: "Suresh", age: 45, sex: "Male", foodPreference: "Veg", isInfant: false }, { name: "Lakshmi", age: 42, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T18"], specialRequests: "Traditional breakfast", paymentMethod: "Cash", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B30", userId: "U20", restaurantId: "R36", date: getDateOffset(-21), time: "12:30 PM", guests: [{ name: "Divya", age: 24, sex: "Female", foodPreference: "Non-Veg", isInfant: false }, { name: "Tanvi", age: 23, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T36"], specialRequests: "Unlimited rice meals", paymentMethod: "UPI", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B31", userId: "U22", restaurantId: "R25", date: getDateOffset(10), time: "7:00 PM", guests: [{ name: "Nikhil", age: 30, sex: "Male", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T25"], specialRequests: "Live tandoor counter", paymentMethod: "Card", paymentStatus: "Paid", bookingStatus: "Upcoming" },
  { id: "B32", userId: "U23", restaurantId: "R29", date: getDateOffset(-24), time: "8:00 PM", guests: [{ name: "Sanjay", age: 38, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Geeta", age: 36, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T29"], specialRequests: "Medium spice level", paymentMethod: "UPI", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B33", userId: "U24", restaurantId: "R48", date: getDateOffset(-45), time: "1:00 PM", guests: [{ name: "Ritu", age: 27, sex: "Female", foodPreference: "Non-Veg", isInfant: false }, { name: "Gaurav", age: 29, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Families", age: 50, sex: "Male", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T48"], specialRequests: "Wazwan feast", paymentMethod: "Card", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B34", userId: "U1", restaurantId: "R39", date: getDateOffset(25), time: "7:00 PM", guests: [{ name: "Roshan", age: 22, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Date", age: 22, sex: "Female", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T39"], specialRequests: "Beach style seating", paymentMethod: "Card", paymentStatus: "Pending", bookingStatus: "Upcoming" },
  { id: "B35", userId: "U4", restaurantId: "R24", date: getDateOffset(-55), time: "11:00 AM", guests: [{ name: "Priya", age: 24, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T24"], specialRequests: "Keto salad bowl", paymentMethod: "UPI", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B36", userId: "U5", restaurantId: "R35", date: getDateOffset(-9), time: "7:30 PM", guests: [{ name: "Amit", age: 26, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Friends", age: 26, sex: "Male", foodPreference: "Veg", isInfant: false }], selectedTables: ["T35"], specialRequests: "Custom pasta", paymentMethod: "Wallet", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B37", userId: "U7", restaurantId: "R28", date: getDateOffset(3), time: "5:00 PM", guests: [{ name: "Sneha", age: 25, sex: "Female", foodPreference: "Veg", isInfant: false }, { name: "BFF", age: 25, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T28"], specialRequests: "Instagrammable desserts", paymentMethod: "Card", paymentStatus: "Paid", bookingStatus: "Upcoming" },
  { id: "B38", userId: "U8", restaurantId: "R20", date: getDateOffset(-35), time: "6:00 PM", guests: [{ name: "Deepak", age: 30, sex: "Male", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T20"], specialRequests: "Egg roll", paymentMethod: "Cash", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B39", userId: "U10", restaurantId: "R31", date: getDateOffset(-19), time: "9:00 AM", guests: [{ name: "Kavita", age: 23, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T31"], specialRequests: "Aloo paratha", paymentMethod: "UPI", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B40", userId: "U11", restaurantId: "R10", date: getDateOffset(2), time: "5:00 PM", guests: [{ name: "Vikram", age: 32, sex: "Male", foodPreference: "Veg", isInfant: false }, { name: "Colleagues", age: 30, sex: "Male", foodPreference: "Veg", isInfant: false }], selectedTables: ["T10"], specialRequests: "Outdoor seating", paymentMethod: "UPI", paymentStatus: "Paid", bookingStatus: "Upcoming" },
  { id: "B41", userId: "U13", restaurantId: "R27", date: getDateOffset(-85), time: "6:30 PM", guests: [{ name: "Manish", age: 27, sex: "Male", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T27"], specialRequests: "Fried momos", paymentMethod: "Cash", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B42", userId: "U14", restaurantId: "R45", date: getDateOffset(7), time: "4:00 PM", guests: [{ name: "Pooja", age: 26, sex: "Female", foodPreference: "Veg", isInfant: false }, { name: "Kids", age: 5, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T45"], specialRequests: "Sugar-free ice cream", paymentMethod: "Card", paymentStatus: "Paid", bookingStatus: "Upcoming" },
  { id: "B43", userId: "U16", restaurantId: "R16", date: getDateOffset(-60), time: "8:00 PM", guests: [{ name: "Rajesh", age: 34, sex: "Male", foodPreference: "Non-Veg", isInfant: false }, { name: "Family", age: 60, sex: "Male", foodPreference: "Veg", isInfant: false }], selectedTables: ["T16"], specialRequests: "Dhaba style", paymentMethod: "Cash", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B44", userId: "U17", restaurantId: "R40", date: getDateOffset(-16), time: "7:00 PM", guests: [{ name: "Aditya", age: 29, sex: "Male", foodPreference: "Non-Veg", isInfant: false }], selectedTables: ["T40"], specialRequests: "Hakka noodles", paymentMethod: "UPI", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "B45", userId: "U19", restaurantId: "R43", date: getDateOffset(20), time: "10:00 AM", guests: [{ name: "Suresh", age: 45, sex: "Male", foodPreference: "Veg", isInfant: false }, { name: "Lakshmi", age: 42, sex: "Female", foodPreference: "Veg", isInfant: false }], selectedTables: ["T43"], specialRequests: "Paper dosa", paymentMethod: "Card", paymentStatus: "Pending", bookingStatus: "Upcoming" }
];

const normalizeSeatIds = (selectedTables) => {
  if (!Array.isArray(selectedTables)) return []
  return selectedTables.map((seat) => String(seat))
}

const buildPricing = (seatCount) => {
  const bookingBase = Math.ceil(300 * 0.6)
  const costPerSeat = Math.ceil(150 * 0.6)
  const subtotal = bookingBase + (seatCount * costPerSeat)
  const discount = Math.ceil(subtotal * 0.1)
  const total = Math.max(0, subtotal - discount)

  return {
    bookingBase,
    costPerSeat,
    selectedSeatCount: seatCount,
    subtotal,
    discount,
    total
  }
}

// Normalized booking dataset for app-level reading and consistent UI display.
// Runtime CRUD still happens in service layer storage while these remain permanent seed records.
export const normalizedSeedBookings = bookings.map((record) => {
  const seatNumbers = normalizeSeatIds(record.selectedTables)
  const pricing = buildPricing(seatNumbers.length)

  // Attendance is restaurant-confirmed data; for seed records default completed bookings to attended.
  const attended = typeof record.attended === 'boolean'
    ? record.attended
    : (record.bookingStatus === 'Completed' ? true : null)

  return {
    ...record,
    selectedSeatIds: seatNumbers,
    seatNumbers,
    paymentStatus: normalizePaymentStatus(record.paymentStatus),
    attended,
    bookingDetails: {
      date: record.date,
      time: record.time,
      guests: record.guests || [],
      selectedTableIds: seatNumbers,
      selectedSeats: seatNumbers.map((seatId) => ({
        id: seatId,
        type: 'Seed Table',
        status: 'Reserved'
      }))
    },
    pricing,
    source: 'seed',
    createdAt: `${record.date}T00:00:00.000Z`,
    statusTimeline: [
      {
        type: 'BOOKING_CREATED',
        status: record.bookingStatus || 'Upcoming',
        at: `${record.date}T00:00:00.000Z`,
        note: 'Seed booking record loaded'
      }
    ]
  }
})
