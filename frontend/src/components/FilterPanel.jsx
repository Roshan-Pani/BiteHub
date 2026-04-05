import React, { useState, useEffect, useRef } from 'react'

function FilterPanel({ activeFilters, onFilterToggle, onLocationChange, onDateChange, onTimeChange, onMealTypeToggle }) {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showMealTypes, setShowMealTypes] = useState(false)
  const [dropdownStyles, setDropdownStyles] = useState({
    location: {},
    date: {},
    time: {},
    meal: {}
  })
  
  const locationRef = useRef(null)
  const dateRef = useRef(null)
  const timeRef = useRef(null)
  const mealRef = useRef(null)

  const anyDropdownOpen = showLocationDropdown || showDatePicker || showTimePicker || showMealTypes

  const closeAllDropdowns = () => {
    setShowLocationDropdown(false)
    setShowDatePicker(false)
    setShowTimePicker(false)
    setShowMealTypes(false)
  }

  const getFloatingStyle = (triggerRef, width) => {
    if (!triggerRef.current) {
      return { width: `${width}px` }
    }

    const rect = triggerRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const gutter = 12
    const nextLeft = Math.min(
      Math.max(gutter, rect.left),
      Math.max(gutter, viewportWidth - width - gutter)
    )

    return {
      top: `${rect.bottom + 8}px`,
      left: `${nextLeft}px`,
      width: `${width}px`
    }
  }

  const updateOpenDropdownPositions = () => {
    setDropdownStyles((prev) => ({
      location: showLocationDropdown ? getFloatingStyle(locationRef, 230) : prev.location,
      date: showDatePicker ? getFloatingStyle(dateRef, 300) : prev.date,
      time: showTimePicker ? getFloatingStyle(timeRef, 230) : prev.time,
      meal: showMealTypes ? getFloatingStyle(mealRef, 260) : prev.meal
    }))
  }

  useEffect(() => {
    if (!anyDropdownOpen) return

    const handleViewportChange = () => updateOpenDropdownPositions()
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)

    return () => {
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('scroll', handleViewportChange, true)
    }
  }, [anyDropdownOpen, showLocationDropdown, showDatePicker, showTimePicker, showMealTypes])

  const toggleDropdown = (key) => {
    const configs = {
      location: { open: showLocationDropdown, setOpen: setShowLocationDropdown, ref: locationRef, width: 230 },
      date: { open: showDatePicker, setOpen: setShowDatePicker, ref: dateRef, width: 300 },
      time: { open: showTimePicker, setOpen: setShowTimePicker, ref: timeRef, width: 230 },
      meal: { open: showMealTypes, setOpen: setShowMealTypes, ref: mealRef, width: 260 }
    }

    const config = configs[key]
    if (!config) return

    if (config.open) {
      config.setOpen(false)
      return
    }

    closeAllDropdowns()
    setDropdownStyles((prev) => ({
      ...prev,
      [key]: getFloatingStyle(config.ref, config.width)
    }))
    config.setOpen(true)
  }

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
    <div className="filter-shell">
      {anyDropdownOpen && (
        <div className="dropdown-backdrop" onClick={closeAllDropdowns}></div>
      )}

      <div className="filter-row">
        
        {/* Location Dropdown Filter */}
        <div className="relative flex-shrink-0" ref={locationRef}>
          <button
            onClick={() => toggleDropdown('location')}
            className="filter-pill"
          >
            <span>{getCurrentLocation()}</span>
            <svg className={`w-4 h-4 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showLocationDropdown && (
            <div className="dropdown-panel" style={dropdownStyles.location}>
              {locations.map((location, index) => {
                const isActive = location.toLowerCase() === activeFilters.location
                return (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className={`dropdown-option ${isActive ? 'dropdown-option--active' : 'dropdown-option--hover'}`}
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
            onClick={() => toggleDropdown('date')}
            className="filter-pill"
          >
            <span>{getSelectedDate()}</span>
            <svg className={`w-4 h-4 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showDatePicker && (
            <div className="dropdown-panel dropdown-panel--wide" style={dropdownStyles.date}>
              <label className="field-label">Select Date</label>
              <input
                type="date"
                value={activeFilters.date || ''}
                onChange={(e) => {
                  onDateChange(e.target.value)
                  setShowDatePicker(false)
                }}
                min={new Date().toISOString().split('T')[0]}
                className="field-input--compact"
              />
              <button
                onClick={() => {
                  onDateChange('')
                  setShowDatePicker(false)
                }}
                className="button-secondary w-full mt-2"
              >
                Clear Date
              </button>
            </div>
          )}
        </div>

        {/* Time Picker */}
        <div className="relative flex-shrink-0" ref={timeRef}>
          <button
            onClick={() => toggleDropdown('time')}
            className="filter-pill"
          >
            <span>{activeFilters.time || 'Any Time'}</span>
            <svg className={`w-4 h-4 transition-transform ${showTimePicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showTimePicker && (
            <div className="dropdown-panel" style={dropdownStyles.time}>
              {timeSlots.map((time, index) => {
                const isActive = time === activeFilters.time
                return (
                  <button
                    key={index}
                    onClick={() => handleTimeSelect(time)}
                    className={`dropdown-option ${isActive ? 'dropdown-option--active' : 'dropdown-option--hover'}`}
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
            onClick={() => toggleDropdown('meal')}
            className={`filter-pill ${getSelectedMealCount() ? 'filter-pill--active' : ''}`}
          >
            <span>Meal Type {getSelectedMealCount() ? `(${getSelectedMealCount()})` : ''}</span>
            <svg className={`w-4 h-4 transition-transform ${showMealTypes ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showMealTypes && (
            <div className="dropdown-panel" style={dropdownStyles.meal}>
              {mealTypes.map((meal) => {
                const isSelected = activeFilters.mealTypes?.includes(meal.id)
                return (
                  <button
                    key={meal.id}
                    onClick={() => onMealTypeToggle(meal.id)}
                    className={`dropdown-option flex items-center gap-3 ${isSelected ? 'dropdown-option--active' : 'dropdown-option--hover'}`}
                  >
                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                      isSelected ? 'border-brand-200 bg-brand-200' : 'border-brand-200'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-brand-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className={`filter-pill ${activeFilters.topRated ? 'filter-pill--active' : ''}`}
        >
          Top Rated (4.5+)
        </button>

        {/* Pure Veg Filter */}
        <button
          onClick={() => onFilterToggle('pureVeg')}
          className={`filter-pill ${activeFilters.pureVeg ? 'filter-pill--active' : ''}`}
        >
          Pure Veg
        </button>

        {/* AC Available Filter */}
        <button
          onClick={() => onFilterToggle('acAvailable')}
          className={`filter-pill ${activeFilters.acAvailable ? 'filter-pill--active' : ''}`}
        >
          AC Available
        </button>
        
      </div>
    </div>
  )
}

export default FilterPanel




