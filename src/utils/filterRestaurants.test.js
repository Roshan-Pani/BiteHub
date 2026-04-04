import test from 'node:test'
import assert from 'node:assert/strict'
import { restaurants } from '../Data/restaurants.js'
import { filterRestaurants } from './filterRestaurants.js'

// Build a baseline filter object and let each test override only the values it
// cares about. This keeps the test cases compact and easy to read.
const buildFilters = (overrides = {}) => ({
  topRated: false,
  pureVeg: false,
  acAvailable: false,
  location: 'all',
  date: '',
  time: 'Any Time',
  mealTypes: [],
  ...overrides
})

// Small, deterministic sample set used to prove the filter engine behavior.
// Each restaurant is designed to represent a different edge case: vegetarian
// match, overnight hours, and a normal lunch/dinner schedule.
const sampleRestaurants = [
  {
    id: 'T1',
    name: 'Morning Veg Hub',
    location: { city: 'Bhubaneswar' },
    cuisine: { name: 'Pure Veg' },
    rating: 4.7,
    isVegOnly: true,
    hasAC: true,
    openingTime: '07:00 AM',
    closingTime: '09:00 PM',
    offDays: ['Monday'],
    unavailableDates: ['2026-04-10'],
    mealTypes: ['breakfast', 'lunch', 'dinner']
  },
  {
    id: 'T2',
    name: 'Night Grill Club',
    location: { city: 'Cuttack' },
    cuisine: { name: 'Mughlai' },
    rating: 4.3,
    isVegOnly: false,
    hasAC: false,
    openingTime: '06:00 PM',
    closingTime: '02:00 AM',
    offDays: [],
    unavailableDates: [],
    mealTypes: ['dinner']
  },
  {
    id: 'T3',
    name: 'City Lunch Spot',
    location: { city: 'Bhubaneswar' },
    cuisine: { name: 'North Indian' },
    rating: 4.6,
    isVegOnly: false,
    hasAC: true,
    openingTime: '11:00 AM',
    closingTime: '11:00 PM',
    offDays: ['Thursday'],
    unavailableDates: ['2026-04-11'],
    mealTypes: ['lunch', 'dinner']
  }
]

test('dataset contains 150 restaurants with multi-image arrays and controlled image repeats', () => {
  // This guards the scaled dataset requirement: 150 total records and a usable
  // multi-image array on every restaurant object.
  assert.equal(restaurants.length, 150)

  restaurants.forEach((restaurant) => {
    assert.ok(Array.isArray(restaurant.images), `${restaurant.id} images should be an array`)
    assert.ok(restaurant.images.length >= 3, `${restaurant.id} should have at least 3 images`)
    assert.ok(Array.isArray(restaurant.mealTypes), `${restaurant.id} should include mealTypes`)
    assert.ok(Array.isArray(restaurant.unavailableDates), `${restaurant.id} should include unavailableDates`)
  })

  const firstImages = restaurants.map((restaurant) => restaurant.images[0])
  const uniqueFirstImages = new Set(firstImages)
  // First-image assignment uses a 110-image pool (100 local + 10 fallback),
  // so 150 restaurants result in 110 unique first images and 40 repeats.
  assert.equal(uniqueFirstImages.size, 110)
})

test('top rated + pure veg + ac + location combination works', () => {
  // Tests a combined filter scenario where multiple toggles must all agree.
  const result = filterRestaurants({
    restaurants: sampleRestaurants,
    searchQuery: '',
    activeFilters: buildFilters({
      topRated: true,
      pureVeg: true,
      acAvailable: true,
      location: 'bhubaneswar'
    })
  })

  assert.deepEqual(result.map((restaurant) => restaurant.id), ['T1'])
})

test('date filter excludes off-day and unavailable dates', () => {
  // A date can fail because of a recurring off-day or because it is explicitly
  // blocked for the restaurant. Both cases should remove the restaurant.
  const mondayDate = '2026-04-06' // Monday
  const unavailableDate = '2026-04-10'

  const mondayResult = filterRestaurants({
    restaurants: sampleRestaurants,
    searchQuery: '',
    activeFilters: buildFilters({ date: mondayDate })
  })

  assert.ok(!mondayResult.some((restaurant) => restaurant.id === 'T1'))

  const unavailableResult = filterRestaurants({
    restaurants: sampleRestaurants,
    searchQuery: '',
    activeFilters: buildFilters({ date: unavailableDate })
  })

  assert.ok(!unavailableResult.some((restaurant) => restaurant.id === 'T1'))
})

test('time filter supports overnight opening hours', () => {
  // Restaurants that stay open after midnight should still match late-night
  // selection values like 01:00 AM.
  const lateNightResult = filterRestaurants({
    restaurants: sampleRestaurants,
    searchQuery: '',
    activeFilters: buildFilters({ time: '01:00 AM' })
  })

  assert.deepEqual(lateNightResult.map((restaurant) => restaurant.id), ['T2'])
})

test('meal type filter matches at least one selected meal type', () => {
  // Multi-select meal filtering is intentionally inclusive: any matching meal
  // type should keep the restaurant in the results.
  const breakfastResult = filterRestaurants({
    restaurants: sampleRestaurants,
    searchQuery: '',
    activeFilters: buildFilters({ mealTypes: ['breakfast'] })
  })

  assert.deepEqual(breakfastResult.map((restaurant) => restaurant.id), ['T1'])

  const dinnerResult = filterRestaurants({
    restaurants: sampleRestaurants,
    searchQuery: '',
    activeFilters: buildFilters({ mealTypes: ['dinner'] })
  })

  assert.deepEqual(dinnerResult.map((restaurant) => restaurant.id), ['T1', 'T2', 'T3'])
})

test('search query works with cuisine and city while combining filters', () => {
  // Search is expected to combine cleanly with the other filters rather than
  // bypass them, so this uses a name/cuisine query plus time and meal criteria.
  const result = filterRestaurants({
    restaurants: sampleRestaurants,
    searchQuery: 'north',
    activeFilters: buildFilters({
      topRated: true,
      acAvailable: true,
      mealTypes: ['lunch'],
      time: '12:30 PM'
    })
  })

  assert.deepEqual(result.map((restaurant) => restaurant.id), ['T3'])
})
