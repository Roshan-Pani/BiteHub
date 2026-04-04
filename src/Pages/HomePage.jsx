import React, { useState } from 'react'
import Header from '../Components/Header'
import FilterPanel from '../Components/FilterPanel'
import RestaurantCards from '../Components/RestaurantCards'
import SingleRestaurantPopup from '../Components/SingleRestaurantPopup'
import { restaurants } from '../Data/restaurants'
import { filterRestaurants } from '../utils/filterRestaurants'

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

  const filteredRestaurants = filterRestaurants({
    restaurants,
    searchQuery,
    activeFilters
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
    <div className="min-h-screen bg-[#F2F2F0]">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      
      {/* Main Content Container */}
      <main className="max-w-[1280px] mx-auto px-6">
        
        {/* Hero Banner Section */}
        <section className="mt-6 mb-8">
          <div className="page-hero">
            
            {/* Content */}
            <div className="page-hero__content">
              <h1 className="page-hero__title">
                Dine Out at the Best Restaurants
              </h1>
              <p className="page-hero__subtitle">
                Discover amazing deals and offers at top-rated restaurants near you
              </p>
              <div className="mt-6 flex gap-4">
                <div className="px-6 py-3 bg-white rounded-full border border-black shadow-sm">
                  <span className="text-black font-bold">{filteredRestaurants.length} Restaurants</span>
                </div>
                <div className="px-6 py-3 bg-white rounded-full border border-black shadow-sm">
                  <span className="text-black font-bold">Instant Booking</span>
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




