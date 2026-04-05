// Convert a human-readable 12-hour time string into a comparable numeric value.
// This avoids fragile string comparisons and lets the time filter work for
// both standard schedules and overnight hours.
const parseTimeToMinutes = (time) => {
  if (!time || typeof time !== 'string') return 0
  const [clock = '00:00', period = 'AM'] = time.trim().split(' ')
  let [hours, minutes] = clock.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  return (hours * 60) + minutes
}

// Determine whether the restaurant is open at the selected time.
// The logic supports overnight closing times by treating schedules that
// wrap past midnight as a valid open interval.
const isRestaurantOpenAtTime = (restaurant, selectedTime) => {
  if (!selectedTime || selectedTime === 'Any Time') return true

  const selected = parseTimeToMinutes(selectedTime)
  const open = parseTimeToMinutes(restaurant.openingTime)
  const close = parseTimeToMinutes(restaurant.closingTime)

  if (close >= open) {
    return selected >= open && selected <= close
  }

  // Overnight hours wrap around midnight, so the selected time is valid if it
  // falls after opening OR before closing in the next day.
  return selected >= open || selected <= close
}

// Determine whether the restaurant can be booked on a calendar date.
// We check both recurring off-days and explicit unavailable dates so the date
// filter is useful for real booking-style scenarios.
const isRestaurantAvailableOnDate = (restaurant, dateValue) => {
  if (!dateValue) return true

  const selectedDate = new Date(dateValue)
  if (Number.isNaN(selectedDate.getTime())) return true

  const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
  const offDays = Array.isArray(restaurant.offDays) ? restaurant.offDays : []
  if (offDays.includes(dayName)) return false

  const unavailableDates = Array.isArray(restaurant.unavailableDates) ? restaurant.unavailableDates : []
  return !unavailableDates.includes(dateValue)
}

// Match restaurants that support at least one of the selected meal types.
// This keeps multi-select meal filtering flexible instead of requiring every
// selected type to be present.
const matchesMealTypeFilter = (restaurant, selectedMealTypes = []) => {
  if (!Array.isArray(selectedMealTypes) || selectedMealTypes.length === 0) return true
  const restaurantMealTypes = Array.isArray(restaurant.mealTypes) ? restaurant.mealTypes : []
  return selectedMealTypes.some((mealType) => restaurantMealTypes.includes(mealType))
}

// Single reusable filter engine used by HomePage and tests.
// It combines search, rating, veg/non-veg, AC availability, location,
// date availability, time availability, and meal-type coverage.
export const filterRestaurants = ({ restaurants, searchQuery, activeFilters }) => {
  const query = (searchQuery || '').trim().toLowerCase()

  return restaurants.filter((restaurant) => {
    // Free-text search across the main restaurant fields.
    const matchesSearch = query === '' ||
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.cuisine.name.toLowerCase().includes(query) ||
      restaurant.location.city.toLowerCase().includes(query)

    // Individual toggle filters are applied only when enabled.
    const matchesTopRated = !activeFilters.topRated || restaurant.rating >= 4.5
    const matchesPureVeg = !activeFilters.pureVeg || restaurant.isVegOnly === true
    const matchesAC = !activeFilters.acAvailable || restaurant.hasAC === true
    const matchesLocation = activeFilters.location === 'all' ||
      restaurant.location.city.toLowerCase() === activeFilters.location.toLowerCase()

    // Availability checks are the important booking-specific part of the filter.
    const matchesDate = isRestaurantAvailableOnDate(restaurant, activeFilters.date)
    const matchesTime = isRestaurantOpenAtTime(restaurant, activeFilters.time)
    const matchesMealType = matchesMealTypeFilter(restaurant, activeFilters.mealTypes)

    return (
      matchesSearch &&
      matchesTopRated &&
      matchesPureVeg &&
      matchesAC &&
      matchesLocation &&
      matchesDate &&
      matchesTime &&
      matchesMealType
    )
  })
}
