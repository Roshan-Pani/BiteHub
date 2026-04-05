// Feedback records are linked to bookings and restaurants so the app can show
// post-visit ratings, written reviews, and real reservation-based examples.
// These entries are used to populate review sections and help demonstrate how
// completed bookings can become public feedback on the restaurant detail pages.

/**
 * Helper to generate dates relative to today (1 day after booking)
 */
const getFeedbackDateOffset = (daysOffset) => {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset + 1) // +1 day after the booking date
  return date.toISOString().split('T')[0]
}

export const feedback = [
  { id: "F1", bookingId: "B1", userId: "U1", restaurantId: "R1", rating: 4, review: "Great ambience and food quality. Window seating was perfect!", createdAt: getFeedbackDateOffset(-10) },
  { id: "F2", bookingId: "B2", userId: "U1", restaurantId: "R8", rating: 5, review: "Amazing sushi! The anniversary setup was beautiful. Highly recommend.", createdAt: getFeedbackDateOffset(-5) },
  { id: "F3", bookingId: "B3", userId: "U4", restaurantId: "R5", rating: 5, review: "Wood-fired pizza was excellent. Birthday cake arrangement was perfect!", createdAt: getFeedbackDateOffset(-20) },
  { id: "F4", bookingId: "B4", userId: "U5", restaurantId: "R13", rating: 4, review: "Best biryani in town! Extra spicy as requested. Great experience.", createdAt: getFeedbackDateOffset(-25) },
  { id: "F6", bookingId: "B6", userId: "U8", restaurantId: "R6", rating: 5, review: "Fresh seafood and beautiful beach view. Staff very helpful with our infant.", createdAt: getFeedbackDateOffset(-30) },
  { id: "F7", bookingId: "B7", userId: "U10", restaurantId: "R21", rating: 4, review: "Authentic Kerala Sadya! Traditional service was great.", createdAt: getFeedbackDateOffset(-15) },
  { id: "F8", bookingId: "B8", userId: "U11", restaurantId: "R4", rating: 4, review: "Rooftop seating with great ambience. Chinese food was delicious.", createdAt: getFeedbackDateOffset(-3) },
  { id: "F9", bookingId: "B9", userId: "U13", restaurantId: "R15", rating: 5, review: "Perfect South Indian breakfast! Filter coffee was exceptional.", createdAt: getFeedbackDateOffset(-60) },
  { id: "F10", bookingId: "B10", userId: "U14", restaurantId: "R38", rating: 5, review: "Korean BBQ experience was fantastic! Tabletop grilling fun.", createdAt: getFeedbackDateOffset(-8) },
  { id: "F12", bookingId: "B12", userId: "U17", restaurantId: "R2", rating: 4, review: "Private booth was cozy. Mughlai dishes were rich and tasty.", createdAt: getFeedbackDateOffset(-12) },
  { id: "F13", bookingId: "B13", userId: "U19", restaurantId: "R50", rating: 5, review: "Sunset beach dining was magical! Fresh seafood amazing.", createdAt: getFeedbackDateOffset(-70) },
  { id: "F14", bookingId: "B14", userId: "U20", restaurantId: "R11", rating: 4, review: "Royal Thali experience was wonderful. Great variety of dishes.", createdAt: getFeedbackDateOffset(-7) },
  { id: "F16", bookingId: "B16", userId: "U23", restaurantId: "R34", rating: 5, review: "Weekend Haleem special was incredible! Authentic Hyderabadi taste.", createdAt: getFeedbackDateOffset(-11) },
  { id: "F17", bookingId: "B17", userId: "U24", restaurantId: "R26", rating: 4, review: "Fresh river fish curry was excellent. Bengali flavors authentic.", createdAt: getFeedbackDateOffset(-18) },
  { id: "F18", bookingId: "B18", userId: "U1", restaurantId: "R9", rating: 4, review: "Unlimited BBQ buffet was great value. Live grill experience fun.", createdAt: getFeedbackDateOffset(-50) },
  { id: "F20", bookingId: "B20", userId: "U5", restaurantId: "R32", rating: 4, review: "Mediterranean dishes were fresh and flavorful. Great for business dinner.", createdAt: getFeedbackDateOffset(-40) },
  { id: "F21", bookingId: "B21", userId: "U7", restaurantId: "R12", rating: 5, review: "Authentic Thai flavors! Curry recommendations were spot on.", createdAt: getFeedbackDateOffset(-14) },
  { id: "F23", bookingId: "B23", userId: "U10", restaurantId: "R3", rating: 4, review: "Healthy vegetarian options. Organic ingredients make a difference.", createdAt: getFeedbackDateOffset(-80) },
  { id: "F24", bookingId: "B24", userId: "U11", restaurantId: "R7", rating: 3, review: "Taco Tuesday deal was good. Food average but value for money.", createdAt: getFeedbackDateOffset(-17) },
  { id: "F25", bookingId: "B25", userId: "U13", restaurantId: "R41", rating: 5, review: "Unlimited thali service excellent! So many items to try.", createdAt: getFeedbackDateOffset(-9) },
  { id: "F26", bookingId: "B26", userId: "U14", restaurantId: "R22", rating: 4, review: "Half-half pizza option great. Thin crust was perfect.", createdAt: getFeedbackDateOffset(-13) },
  { id: "F27", bookingId: "B27", userId: "U16", restaurantId: "R14", rating: 5, review: "Sunday brunch special amazing! Kids friendly atmosphere.", createdAt: getFeedbackDateOffset(-65) },
  { id: "F29", bookingId: "B29", userId: "U19", restaurantId: "R18", rating: 4, review: "Traditional Udupi breakfast was authentic. Pure veg options great.", createdAt: getFeedbackDateOffset(-75) },
  { id: "F30", bookingId: "B30", userId: "U20", restaurantId: "R36", rating: 4, review: "Unlimited Andhra rice meals spicy and delicious!", createdAt: getFeedbackDateOffset(-21) },
  { id: "F32", bookingId: "B32", userId: "U23", restaurantId: "R29", rating: 4, review: "Chettinad spices perfect! Medium spice was still quite hot.", createdAt: getFeedbackDateOffset(-24) },
  { id: "F33", bookingId: "B33", userId: "U24", restaurantId: "R48", rating: 5, review: "Kashmiri Wazwan feast was royal! Rista and Gushtaba excellent.", createdAt: getFeedbackDateOffset(-45) },
  { id: "F35", bookingId: "B35", userId: "U4", restaurantId: "R24", rating: 4, review: "Keto salad bowl fresh and filling. Health-conscious options good.", createdAt: getFeedbackDateOffset(-55) },
  { id: "F36", bookingId: "B36", userId: "U5", restaurantId: "R35", rating: 4, review: "Make your own pasta concept fun! Fresh ingredients.", createdAt: getFeedbackDateOffset(-9) },
  { id: "F38", bookingId: "B38", userId: "U8", restaurantId: "R20", rating: 3, review: "Egg roll decent. Quick street food fix.", createdAt: getFeedbackDateOffset(-35) },
  { id: "F39", bookingId: "B39", userId: "U10", restaurantId: "R31", rating: 4, review: "Aloo paratha stuffing generous. So many varieties available!", createdAt: getFeedbackDateOffset(-19) },
  { id: "F41", bookingId: "B41", userId: "U13", restaurantId: "R27", rating: 4, review: "Homemade momos taste authentic. Fried momos crispy.", createdAt: getFeedbackDateOffset(-85) },
  { id: "F43", bookingId: "B43", userId: "U16", restaurantId: "R16", rating: 3, review: "Dhaba style food authentic but service slow.", createdAt: getFeedbackDateOffset(-60) },
  { id: "F44", bookingId: "B44", userId: "U17", restaurantId: "R40", rating: 4, review: "Hakka noodles portion good. Customization options great.", createdAt: getFeedbackDateOffset(-16) }
];

// Normalized feedback dataset for consistent read-model usage.
export const normalizedSeedFeedback = feedback.map((entry) => ({
  ...entry,
  submittedAt: entry.createdAt,
  source: 'seed'
}))
