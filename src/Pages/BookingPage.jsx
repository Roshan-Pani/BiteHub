import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../Components/Header'
import { restaurants } from '../Data/restaurants'

function BookingPage() {
  const { restaurantId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // Find the restaurant
  const restaurant = restaurants.find(r => r.id === restaurantId)

  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    time: '',
    guests: [{
      id: 1,
      name: user?.name || '',
      age: '',
      sex: '',
      foodPreference: ''
    }],
    selectedSeats: [],
    paymentMethod: 'card'
  })

  const [errors, setErrors] = useState({})

  if (!restaurant) {
    navigate('/')
    return null
  }

  const addGuest = () => {
    setBookingDetails(prev => ({
      ...prev,
      guests: [...prev.guests, {
        id: prev.guests.length + 1,
        name: '',
        age: '',
        sex: '',
        foodPreference: ''
      }]
    }))
  }

  const removeGuest = (guestId) => {
    if (bookingDetails.guests.length === 1) return
    setBookingDetails(prev => ({
      ...prev,
      guests: prev.guests.filter(g => g.id !== guestId)
    }))
  }

  const updateGuest = (guestId, field, value) => {
    setBookingDetails(prev => ({
      ...prev,
      guests: prev.guests.map(g => 
        g.id === guestId ? { ...g, [field]: value } : g
      )
    }))
  }

  const handleSeatToggle = (seatId) => {
    setBookingDetails(prev => {
      const isSelected = prev.selectedSeats.includes(seatId)
      return {
        ...prev,
        selectedSeats: isSelected 
          ? prev.selectedSeats.filter(id => id !== seatId)
          : [...prev.selectedSeats, seatId]
      }
    })
  }

  const validateBooking = () => {
    const newErrors = {}

    if (!bookingDetails.date) newErrors.date = 'Please select a date'
    if (!bookingDetails.time) newErrors.time = 'Please select a time'
    if (bookingDetails.selectedSeats.length === 0) newErrors.seats = 'Please select at least one table'

    bookingDetails.guests.forEach((guest, idx) => {
      if (!guest.name) newErrors[`guest${idx}Name`] = true
      if (!guest.age || guest.age < 1) newErrors[`guest${idx}Age`] = true
      if (!guest.sex) newErrors[`guest${idx}Sex`] = true
      if (!guest.foodPreference) newErrors[`guest${idx}Food`] = true
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProceedToPayment = () => {
    if (validateBooking()) {
      const bookingId = `${restaurantId}-${Date.now()}`
      localStorage.setItem(`booking-${bookingId}`, JSON.stringify({
        restaurant,
        bookingDetails,
        createdAt: new Date().toISOString()
      }))
      navigate(`/payment/${bookingId}`)
    } else {
      alert('Please fill in all required fields')
    }
  }

  const totalGuests = bookingDetails.guests.length
  const infantCount = bookingDetails.guests.filter(g => parseInt(g.age) < 2).length

  return (
    <div className="min-h-screen bg-stone-50/30">
      <Header />
      
      <main className="max-w-[1280px] mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-800 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-stone-800">Complete Your Booking</h1>
          <p className="text-stone-600 mt-2">Reserve a table at {restaurant.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Date & Time Selection */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-stone-800 mb-4">📅 When?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={bookingDetails.date}
                    onChange={(e) => setBookingDetails(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border ${errors.date ? 'border-red-400' : 'border-stone-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/40`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Time</label>
                  <select
                    value={bookingDetails.time}
                    onChange={(e) => setBookingDetails(prev => ({ ...prev, time: e.target.value }))}
                    className={`w-full px-4 py-3 border ${errors.time ? 'border-red-400' : 'border-stone-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/40`}
                  >
                    <option value="">Select Time</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                    <option value="08:00 PM">08:00 PM</option>
                    <option value="09:00 PM">09:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Guest Details */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-stone-800">👥 Guest Details</h2>
                <button
                  onClick={addGuest}
                  className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-semibold"
                >
                  + Add Guest
                </button>
              </div>

              <div className="space-y-4">
                {bookingDetails.guests.map((guest, idx) => (
                  <div key={guest.id} className="p-4 border border-stone-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-stone-700">Guest {idx + 1}</h3>
                      {bookingDetails.guests.length > 1 && (
                        <button
                          onClick={() => removeGuest(guest.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Name *</label>
                        <input
                          type="text"
                          value={guest.name}
                          onChange={(e) => updateGuest(guest.id, 'name', e.target.value)}
                          placeholder="Full Name"
                          className={`w-full px-3 py-2 border ${errors[`guest${idx}Name`] ? 'border-red-400' : 'border-stone-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/40 text-sm`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Age *</label>
                        <input
                          type="number"
                          value={guest.age}
                          onChange={(e) => updateGuest(guest.id, 'age', e.target.value)}
                          placeholder="Age"
                          min="0"
                          max="120"
                          className={`w-full px-3 py-2 border ${errors[`guest${idx}Age`] ? 'border-red-400' : 'border-stone-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/40 text-sm`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Gender *</label>
                        <select
                          value={guest.sex}
                          onChange={(e) => updateGuest(guest.id, 'sex', e.target.value)}
                          className={`w-full px-3 py-2 border ${errors[`guest${idx}Sex`] ? 'border-red-400' : 'border-stone-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/40 text-sm`}
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Food Preference *</label>
                        <select
                          value={guest.foodPreference}
                          onChange={(e) => updateGuest(guest.id, 'foodPreference', e.target.value)}
                          className={`w-full px-3 py-2 border ${errors[`guest${idx}Food`] ? 'border-red-400' : 'border-stone-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/40 text-sm`}
                        >
                          <option value="">Select</option>
                          <option value="Veg">Vegetarian</option>
                          <option value="Non-Veg">Non-Vegetarian</option>
                          <option value="Vegan">Vegan</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {infantCount > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    ℹ️ {infantCount} infant{infantCount > 1 ? 's' : ''} (under 2 years) - Separate seating not required
                  </p>
                </div>
              )}
            </div>

            {/* Seating Selection - Moved to separate component below */}

            {/* Payment Method */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-stone-800 mb-4">💳 Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-stone-200 rounded-xl cursor-pointer hover:border-amber-400/70 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={bookingDetails.paymentMethod === 'card'}
                    onChange={(e) => setBookingDetails(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-5 h-5 text-amber-600"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-stone-800">Credit / Debit Card</p>
                    <p className="text-sm text-stone-500">Secure payment via gateway</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border-2 border-stone-200 rounded-xl cursor-pointer hover:border-amber-400/70 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="restaurant"
                    checked={bookingDetails.paymentMethod === 'restaurant'}
                    onChange={(e) => setBookingDetails(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-5 h-5 text-amber-600"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-stone-800">Pay at Restaurant</p>
                    <p className="text-sm text-stone-500">Pay when you dine</p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Sidebar - Summary & Seating */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Visual Seating Selection */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-stone-800 mb-4">🪑 Select Table</h2>
                {errors.seats && <p className="text-red-500 text-sm mb-2">{errors.seats}</p>}
                <div className="space-y-3">
                  {restaurant.tabledescription.tableTypesAvailable.map((tableType, idx) => {
                    const capacity = restaurant.tabledescription.seatsPerTable[idx]
                    const seatId = `${tableType}-${idx}`
                    const isSelected = bookingDetails.selectedSeats.includes(seatId)
                    const isAvailable = Math.random() > 0.3 // Mock availability
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => isAvailable && handleSeatToggle(seatId)}
                        disabled={!isAvailable}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          !isAvailable 
                            ? 'bg-stone-100 border-stone-200 cursor-not-allowed opacity-50'
                            : isSelected
                            ? 'bg-amber-50 border-amber-500 shadow-md'
                            : 'border-stone-200 hover:border-amber-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-stone-800">{tableType}</p>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected ? 'bg-amber-600 border-amber-600' : 'border-stone-300'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-stone-600">
                          <span>👥 {capacity} seats</span>
                          <span className={isAvailable ? 'text-green-600' : 'text-red-600'}>
                            {isAvailable ? '✓ Available' : '✗ Booked'}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-stone-800 mb-4">Booking Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Restaurant</span>
                    <span className="font-semibold">{restaurant.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Total Guests</span>
                    <span className="font-semibold">{totalGuests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Tables Selected</span>
                    <span className="font-semibold">{bookingDetails.selectedSeats.length}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-stone-600">Base Price</span>
                    <span className="font-semibold">₹{bookingDetails.selectedSeats.length * 500}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{bookingDetails.selectedSeats.length * 50}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t">
                    <span>Total</span>
                    <span className="text-amber-600">₹{bookingDetails.selectedSeats.length * 450}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleProceedToPayment}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-amber-400/90 to-orange-500/90 text-white font-bold rounded-2xl hover:shadow-xl hover:from-amber-500/90 hover:to-orange-600/90 transition-all"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default BookingPage
