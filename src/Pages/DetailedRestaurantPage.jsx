import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../Components/Header'
import { restaurants } from '../Data/restaurants'

function DetailedRestaurantPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  // Find restaurant by ID
  const restaurant = restaurants.find(r => r.id === id)
  
  // Redirect if restaurant not found
  if (!restaurant) {
    navigate('/')
    return null
  }

  const getFallbackImage = (cuisineName) => {
    const cuisineImages = {
      'North Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1600',
      'Mughlai': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=1600',
      'Chinese': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=1600',
      'Italian': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600',
      'Japanese': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1600',
      'Korean': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=1600',
      'default': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600'
    }
    return cuisineImages[cuisineName] || cuisineImages.default
  }

  return (
    <div className="min-h-screen bg-stone-50/30">
      <Header />
      
      {/* Hero Section with Image Banner */}
      <section className="relative w-full h-96 bg-stone-800">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={getFallbackImage(restaurant.cuisine.name)}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        {/* Floating Info Card */}
        <div className="relative max-w-[1280px] mx-auto px-6 h-full flex items-end pb-8">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-2xl w-full transform translate-y-12">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-stone-800 mb-2">{restaurant.name}</h1>
                <p className="text-gray-600 mb-3">{restaurant.cuisine.name} • {restaurant.cuisine.description}</p>
                <div className="flex items-center gap-2 text-stone-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="text-sm">{restaurant.location.specialIdentification}, {restaurant.location.city}</span>
                </div>
              </div>
              
              {/* Rating */}
              <div className="px-5 py-3 bg-green-600/90 text-white text-xl font-bold rounded-2xl flex items-center gap-2 shadow-lg">
                <span>⭐</span>
                <span>{restaurant.rating.toFixed(1)}</span>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-6 pt-4 border-t border-stone-100">
              <div>
                <p className="text-xs text-stone-500 mb-1">Type</p>
                <p className="font-bold text-stone-800">{restaurant.isVegOnly ? 'Pure Veg' : 'Veg & Non-Veg'}</p>
              </div>
              <div className="border-l border-stone-200 pl-6">
                <p className="text-xs text-stone-500 mb-1">Status</p>
                <p className="font-bold text-green-600">Open Now</p>
              </div>
              <div className="border-l border-stone-200 pl-6">
                <p className="text-xs text-stone-500 mb-1">Timings</p>
                <p className="font-bold text-stone-800">{restaurant.openingTime} - {restaurant.closingTime}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="max-w-[1280px] mx-auto px-6 mt-20">
        
        {/* Tab Navigation */}
        <div className="mb-8 border-b border-stone-200">
          <div className="flex gap-8">
            <button className="pb-4 text-amber-600 font-semibold border-b-2 border-amber-500">
              Dine Out
            </button>
            <button className="pb-4 text-stone-500 font-medium hover:text-stone-700">
              Photos ({restaurant.images.length})
            </button>
            <button className="pb-4 text-stone-500 font-medium hover:text-stone-700">
              Menu
            </button>
            <button className="pb-4 text-stone-500 font-medium hover:text-stone-700">
              Reviews
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Offers Section */}
            {restaurant.specialMessages && (
              <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎉</span>
                  Special Info
                </h2>
                <div className="p-4 bg-gradient-to-r from-amber-50/80 to-orange-50/70 rounded-xl border border-amber-200/50">
                  <p className="font-semibold text-amber-700 mb-1">{restaurant.specialMessages}</p>
                </div>
              </section>
            )}
            
            {/* Cuisine & Features */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-stone-800 mb-4">Cuisine & Features</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-stone-500 mb-2">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-amber-50/80 text-amber-700 rounded-full text-sm font-medium">{restaurant.cuisine.name}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-stone-500 mb-2">Facilities</p>
                  <div className="grid grid-cols-2 gap-3">
                    {restaurant.hasAC && (
                      <div className="flex items-center gap-2 text-stone-700">
                        <span className="text-green-600">✓</span>
                        <span className="text-sm">AC Available</span>
                      </div>
                    )}
                    {restaurant.tabledescription.tableTypesAvailable.map((type, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-stone-700">
                        <span className="text-green-600">✓</span>
                        <span className="text-sm">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            
            {/* Location Section */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-stone-800 mb-4">Location & Contact</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-stone-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <div>
                    <p className="text-stone-700">{restaurant.location.specialIdentification}</p>
                    <p className="text-sm text-stone-500">{restaurant.location.city}, {restaurant.location.state} - {restaurant.location.pin}</p>
                  </div>
                </div>
                
                {/* Map Placeholder */}
                <div className="w-full h-48 bg-stone-100/50 rounded-xl flex items-center justify-center">
                  <div className="text-center text-stone-400">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-sm">Map View</p>
                  </div>
                </div>
              </div>
            </section>
            
          </div>
          
          {/* Right Column: Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-stone-800 mb-6">Reserve Your Table</h3>
              
              {/* Booking Form UI */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Select Date</label>
                  <div className="p-3 border border-stone-200 rounded-xl hover:border-amber-300/70 transition-colors cursor-pointer">
                    <span className="text-stone-600">📅 Feb 20, 2026</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Select Time</label>
                  <div className="p-3 border border-stone-200 rounded-xl hover:border-amber-300/70 transition-colors cursor-pointer">
                    <span className="text-stone-600">🕐 7:30 PM</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Guests</label>
                  <div className="p-3 border border-stone-200 rounded-xl hover:border-amber-300/70 transition-colors cursor-pointer">
                    <span className="text-stone-600">👥 2 People</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Table Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {restaurant.tabledescription.tableTypesAvailable.slice(0, 2).map((type, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-xl text-center cursor-pointer ${
                          idx === 0 
                            ? 'border-2 border-amber-500/70 bg-amber-50/50' 
                            : 'border border-stone-200 hover:border-amber-300/70'
                        }`}
                      >
                        <p className={`text-sm font-semibold ${
                          idx === 0 ? 'text-amber-700' : 'text-stone-600'
                        }`}>{type}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Summary */}
                <div className="pt-4 border-t border-stone-100">
                  <div className="flex justify-between mb-2">
                    <span className="text-stone-600">Base Price</span>
                    <span className="font-semibold">₹800</span>
                  </div>
                  <div className="flex justify-between text-green-600 mb-2">
                    <span>Discount (10%)</span>
                    <span className="font-semibold">-₹80</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-amber-600">₹720</span>
                  </div>
                </div>
                
                {/* Book Button */}
                <button 
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate(`/booking/${restaurant.id}`)
                    } else {
                      navigate('/login', { state: { from: `/booking/${restaurant.id}` } })
                    }
                  }}
                  className="w-full py-4 bg-gradient-to-r from-amber-400/90 to-orange-500/90 text-white font-bold rounded-2xl hover:shadow-xl hover:from-amber-500/90 hover:to-orange-600/90 transition-all"
                >
                  {isAuthenticated ? 'Confirm Booking' : 'Sign In to Book'}
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  )
}

export default DetailedRestaurantPage