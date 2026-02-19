import React, { useState } from 'react'
import Header from '../Components/Header'
import FilterPanel from '../Components/FilterPanel'
import RestaurantCards from '../Components/RestaurantCards'
import SingleRestaurantPopup from '../Components/SingleRestaurantPopup'
import { restaurants } from '../Data/restaurants'

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState({
    topRated: false,
    pureVeg: false,
    acAvailable: false,
    location: 'all',
    date: '',
    time: 'Any Time',
    mealTypes: [] // breakfast, lunch, dinner
  })
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)

  // Filter restaurants based on search and active filters
  const filteredRestaurants = restaurants.filter(restaurant => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.location.city.toLowerCase().includes(searchQuery.toLowerCase())

    // Top Rated filter (rating >= 4.5)
    const matchesTopRated = !activeFilters.topRated || restaurant.rating >= 4.5

    // Pure Veg filter
    const matchesPureVeg = !activeFilters.pureVeg || restaurant.isVegOnly === true

    // AC Available filter
    const matchesAC = !activeFilters.acAvailable || restaurant.hasAC === true

    // Location filter
    const matchesLocation = activeFilters.location === 'all' || 
      restaurant.location.city.toLowerCase() === activeFilters.location.toLowerCase()

    // Date filter (just check if restaurant is open on that day of week)
    const matchesDate = !activeFilters.date || (() => {
      const selectedDate = new Date(activeFilters.date)
      const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
      return !restaurant.offDays.includes(dayName)
    })()

    // Time filter (check if within opening hours)
    const matchesTime = activeFilters.time === 'Any Time' || (() => {
      // Simplified check - in production, you'd parse and compare times properly
      return true // For now, assume all restaurants match
    })()

    // Meal type filter (if any selected, restaurant must support at least one)
    const matchesMealType = activeFilters.mealTypes.length === 0 || (() => {
      // For now, assume all restaurants serve all meal types
      // In production, you'd check restaurant.mealTypes array
      return true
    })()

    return matchesSearch && matchesTopRated && matchesPureVeg && matchesAC && 
           matchesLocation && matchesDate && matchesTime && matchesMealType
  })

  const handleSearchChange = (query) => {
    setSearchQuery(query)
  }

  const handleFilterToggle = (filterKey) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }))
  }

  const handleLocationChange = (location) => {
    setActiveFilters(prev => ({
      ...prev,
      location: location
    }))
  }

  const handleDateChange = (date) => {
    setActiveFilters(prev => ({
      ...prev,
      date: date
    }))
  }

  const handleTimeChange = (time) => {
    setActiveFilters(prev => ({
      ...prev,
      time: time
    }))
  }

  const handleMealTypeToggle = (mealType) => {
    setActiveFilters(prev => ({
      ...prev,
      mealTypes: prev.mealTypes.includes(mealType)
        ? prev.mealTypes.filter(t => t !== mealType)
        : [...prev.mealTypes, mealType]
    }))
  }

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant)
  }

  const handleCloseModal = () => {
    setSelectedRestaurant(null)
  }

  return (
    <div className="min-h-screen bg-stone-50/30">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      
      {/* Main Content Container */}
      <main className="max-w-[1280px] mx-auto px-6">
        
        {/* Hero Banner Section */}
        <section className="mt-6 mb-8">
          <div className="relative w-full h-64 rounded-3xl overflow-hidden shadow-lg bg-gradient-to-r from-amber-200/80 via-orange-300/70 to-amber-300/80">
            {/* Background overlay with pattern */}
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Content */}
            <div className="relative h-full flex flex-col justify-center px-12">
              <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-3">
                Dine Out at the Best Restaurants
              </h1>
              <p className="text-lg text-stone-700 max-w-xl">
                Discover amazing deals and offers at top-rated restaurants near you
              </p>
              <div className="mt-6 flex gap-4">
                <div className="px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full border border-white/50 shadow-sm">
                  <span className="text-stone-700 font-medium">🎉 {filteredRestaurants.length} Restaurants</span>
                </div>
                <div className="px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full border border-white/50 shadow-sm">
                  <span className="text-stone-700 font-medium">⚡ Instant Booking</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Filter Bar Section */}
        <section className="mb-6 relative z-10">
          <FilterPanel 
            activeFilters={activeFilters}
            onFilterToggle={handleFilterToggle}
            onLocationChange={handleLocationChange}
            onDateChange={handleDateChange}
            onTimeChange={handleTimeChange}
            onMealTypeToggle={handleMealTypeToggle}
          />
        </section>
        
        {/* Restaurant Grid Section */}
        <section className="pb-12">
          <RestaurantCards 
            restaurants={filteredRestaurants}
            onRestaurantClick={handleRestaurantClick}
          />
        </section>
        
      </main>

      {/* Restaurant Quick View Modal */}
      {selectedRestaurant && (
        <SingleRestaurantPopup 
          restaurant={selectedRestaurant}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default HomePage
