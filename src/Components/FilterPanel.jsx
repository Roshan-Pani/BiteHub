import React, { useState, useEffect, useRef } from 'react'

function FilterPanel({ activeFilters, onFilterToggle, onLocationChange, onDateChange, onTimeChange, onMealTypeToggle }) {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showMealTypes, setShowMealTypes] = useState(false)
  
  const locationRef = useRef(null)
  const dateRef = useRef(null)
  const timeRef = useRef(null)
  const mealRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationDropdown(false)
      }
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setShowDatePicker(false)
      }
      if (timeRef.current && !timeRef.current.contains(event.target)) {
        setShowTimePicker(false)
      }
      if (mealRef.current && !mealRef.current.contains(event.target)) {
        setShowMealTypes(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const locations = ['All', 'Bhubaneswar', 'Cuttack', 'Puri', 'Rourkela', 'Sambalpur', 'Balasore', 'Berhampur']
  
  const timeSlots = [
    'Any Time',
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM'
  ]

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { id: 'lunch', label: 'Lunch', icon: '☀️' },
    { id: 'dinner', label: 'Dinner', icon: '🌙' }
  ]

  const handleLocationSelect = (location) => {
    onLocationChange(location.toLowerCase())
    setShowLocationDropdown(false)
  }

  const handleTimeSelect = (time) => {
    onTimeChange(time)
    setShowTimePicker(false)
  }

  const getCurrentLocation = () => {
    if (activeFilters.location === 'all') return 'All Locations'
    return activeFilters.location.charAt(0).toUpperCase() + activeFilters.location.slice(1)
  }

  const getSelectedDate = () => {
    if (!activeFilters.date) return 'Any Date'
    const date = new Date(activeFilters.date)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getSelectedMealCount = () => {
    const count = activeFilters.mealTypes?.length || 0
    return count > 0 ? count : null
  }

  return (
    <div className="w-full relative">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
        
        {/* Location Dropdown Filter */}
        <div className="relative flex-shrink-0" ref={locationRef}>
          <button
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-stone-200 rounded-full text-sm font-medium text-stone-700 hover:border-amber-300/70 hover:shadow-sm transition-all"
          >
            <span>📍</span>
            <span>{getCurrentLocation()}</span>
            <svg className={`w-4 h-4 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showLocationDropdown && (
            <div className="absolute top-full mt-2 left-0 w-48 bg-white border border-stone-200 rounded-2xl shadow-2xl z-[9999] py-2 max-h-64 overflow-y-auto">
              {locations.map((location, index) => {
                const isActive = location.toLowerCase() === activeFilters.location
                return (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                      isActive 
                        ? 'bg-amber-50/70 text-amber-700 font-semibold' 
                        : 'hover:bg-amber-50/50 hover:text-amber-700'
                    }`}
                  >
                    {location}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Date Picker */}
        <div className="relative flex-shrink-0" ref={dateRef}>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-stone-200 rounded-full text-sm font-medium text-stone-700 hover:border-amber-300/70 hover:shadow-sm transition-all"
          >
            <span>📅</span>
            <span>{getSelectedDate()}</span>
            <svg className={`w-4 h-4 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showDatePicker && (
            <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-stone-200 rounded-2xl shadow-2xl z-[9999] p-4">
              <label className="block text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wide">Select Date</label>
              <input
                type="date"
                value={activeFilters.date || ''}
                onChange={(e) => {
                  onDateChange(e.target.value)
                  setShowDatePicker(false)
                }}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              />
              <button
                onClick={() => {
                  onDateChange('')
                  setShowDatePicker(false)
                }}
                className="w-full mt-2 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              >
                Clear Date
              </button>
            </div>
          )}
        </div>

        {/* Time Picker */}
        <div className="relative flex-shrink-0" ref={timeRef}>
          <button
            onClick={() => setShowTimePicker(!showTimePicker)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-stone-200 rounded-full text-sm font-medium text-stone-700 hover:border-amber-300/70 hover:shadow-sm transition-all"
          >
            <span>🕐</span>
            <span>{activeFilters.time || 'Any Time'}</span>
            <svg className={`w-4 h-4 transition-transform ${showTimePicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showTimePicker && (
            <div className="absolute top-full mt-2 left-0 w-48 bg-white border border-stone-200 rounded-2xl shadow-2xl z-[9999] py-2 max-h-64 overflow-y-auto">
              {timeSlots.map((time, index) => {
                const isActive = time === activeFilters.time
                return (
                  <button
                    key={index}
                    onClick={() => handleTimeSelect(time)}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                      isActive 
                        ? 'bg-amber-50/70 text-amber-700 font-semibold' 
                        : 'hover:bg-amber-50/50 hover:text-amber-700'
                    }`}
                  >
                    {time}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Meal Type Multi-Select */}
        <div className="relative flex-shrink-0" ref={mealRef}>
          <button
            onClick={() => setShowMealTypes(!showMealTypes)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
              getSelectedMealCount()
                ? 'bg-amber-400/80 text-white shadow-md shadow-amber-200/50'
                : 'bg-white/80 text-stone-700 border border-stone-200 hover:border-amber-300/70 hover:shadow-sm'
            }`}
          >
            <span>🍽️</span>
            <span>Meal Type {getSelectedMealCount() ? `(${getSelectedMealCount()})` : ''}</span>
            <svg className={`w-4 h-4 transition-transform ${showMealTypes ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showMealTypes && (
            <div className="absolute top-full mt-2 left-0 w-56 bg-white border border-stone-200 rounded-2xl shadow-2xl z-[9999] py-2">
              {mealTypes.map((meal) => {
                const isSelected = activeFilters.mealTypes?.includes(meal.id)
                return (
                  <button
                    key={meal.id}
                    onClick={() => onMealTypeToggle(meal.id)}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-3 ${
                      isSelected 
                        ? 'bg-amber-50/70 text-amber-700' 
                        : 'hover:bg-amber-50/50 hover:text-amber-700'
                    }`}
                  >
                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                      isSelected ? 'border-amber-600 bg-amber-600' : 'border-stone-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span>{meal.icon}</span>
                    <span className={isSelected ? 'font-semibold' : ''}>{meal.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Top Rated Filter */}
        <button
          onClick={() => onFilterToggle('topRated')}
          className={`
            flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200
            ${activeFilters.topRated
              ? 'bg-amber-400/80 text-white shadow-md shadow-amber-200/50' 
              : 'bg-white/80 text-stone-700 border border-stone-200 hover:border-amber-300/70 hover:shadow-sm'
            }
          `}
        >
          <span className="mr-2">⭐</span>
          Top Rated (4.5+)
        </button>

        {/* Pure Veg Filter */}
        <button
          onClick={() => onFilterToggle('pureVeg')}
          className={`
            flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200
            ${activeFilters.pureVeg
              ? 'bg-amber-400/80 text-white shadow-md shadow-amber-200/50' 
              : 'bg-white/80 text-stone-700 border border-stone-200 hover:border-amber-300/70 hover:shadow-sm'
            }
          `}
        >
          <span className="mr-2">🌱</span>
          Pure Veg
        </button>

        {/* AC Available Filter */}
        <button
          onClick={() => onFilterToggle('acAvailable')}
          className={`
            flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200
            ${activeFilters.acAvailable
              ? 'bg-amber-400/80 text-white shadow-md shadow-amber-200/50' 
              : 'bg-white/80 text-stone-700 border border-stone-200 hover:border-amber-300/70 hover:shadow-sm'
            }
          `}
        >
          <span className="mr-2">❄️</span>
          AC Available
        </button>
        
      </div>
    </div>
  )
}

export default FilterPanel
