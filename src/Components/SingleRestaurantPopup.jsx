import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function SingleRestaurantPopup({ restaurant, onClose }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const getFallbackImage = (cuisineName) => {
    const cuisineImages = {
      'North Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      'Mughlai': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
      'Chinese': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800',
      'Italian': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
      'Japanese': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
      'Korean': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800',
      'default': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
    }
    return cuisineImages[cuisineName] || cuisineImages.default
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    /* Modal Overlay */
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-lg transition-all"
        >
          <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Modal Content */}
        <div className="flex flex-col md:flex-row max-h-[85vh] overflow-y-auto">
          
          {/* Left Section: Image */}
          <div className="relative md:w-1/2 h-64 md:h-auto">
            <img
              src={getFallbackImage(restaurant.cuisine.name)}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            
            {/* Rating Badge */}
            <div className="absolute top-4 left-4 px-4 py-2 bg-green-600/90 text-white text-base font-bold rounded-xl flex items-center gap-2 shadow-lg">
              <span>⭐</span>
              <span>{restaurant.rating.toFixed(1)}</span>
            </div>
            
            {/* Veg/Non-Veg Badge */}
            <div className="absolute top-4 right-4">
              {restaurant.isVegOnly ? (
                <div className="px-4 py-2 bg-green-600/90 text-white text-sm font-bold rounded-xl shadow-lg">
                  🌱 Pure Veg
                </div>
              ) : (
                <div className="px-4 py-2 bg-red-600/90 text-white text-sm font-bold rounded-xl shadow-lg">
                  🍗 Non-Veg
                </div>
              )}
            </div>
            
            {/* Image Gallery Indicator */}
            <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-sm text-white text-sm rounded-lg">
              📷 View Gallery ({restaurant.images.length})
            </div>
          </div>
          
          {/* Right Section: Details */}
          <div className="md:w-1/2 p-8">
            
            {/* Restaurant Name & Info */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-stone-800 mb-2">
                {restaurant.name}
              </h2>
              <p className="text-gray-600 mb-3">
                {restaurant.cuisine.name} • {restaurant.cuisine.description}
              </p>
              
              {/* Location */}
              <div className="flex items-start gap-2 text-stone-500">
                <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="text-sm">
                  {restaurant.location.specialIdentification}, {restaurant.location.city}, {restaurant.location.state} - {restaurant.location.pin}
                </span>
              </div>
            </div>
            
            {/* Special Message/Offer Banner */}
            {restaurant.specialMessages && (
              <div className="mb-6 p-4 bg-gradient-to-r from-amber-50/80 to-orange-50/70 rounded-2xl border border-amber-200/50">
                <div className="flex items-center gap-2 text-amber-700 font-semibold mb-1">
                  <span className="text-lg">🎉</span>
                  <span>Special Info</span>
                </div>
                <p className="text-sm text-amber-700">
                  {restaurant.specialMessages}
                </p>
              </div>
            )}
            
            {/* Quick Info */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50/80 rounded-full flex items-center justify-center">
                  <span className="text-lg">�</span>
                </div>
                <div>
                  <p className="text-xs text-stone-500">Opening Hours</p>
                  <p className="font-semibold text-stone-800">
                    {restaurant.openingTime} - {restaurant.closingTime}
                  </p>
                </div>
              </div>
              
              {restaurant.offDays.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50/80 rounded-full flex items-center justify-center">
                    <span className="text-lg">🚫</span>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500">Off Days</p>
                    <p className="font-semibold text-stone-800">
                      {restaurant.offDays.join(', ')}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50/80 rounded-full flex items-center justify-center">
                  <span className="text-lg">❄️</span>
                </div>
                <div>
                  <p className="text-xs text-stone-500">Facilities</p>
                  <p className="font-semibold text-stone-800">
                    {restaurant.hasAC ? 'AC Available' : 'Non-AC'}, {restaurant.tabledescription.tableTypesAvailable.join(', ')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    navigate(`/booking/${restaurant.id}`)
                    onClose()
                  } else {
                    onClose()
                    navigate('/login', { state: { from: `/booking/${restaurant.id}` } })
                  }
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400/90 to-orange-500/90 text-white font-semibold rounded-2xl hover:shadow-lg hover:from-amber-500/90 hover:to-orange-600/90 transition-all"
              >
                {isAuthenticated ? 'Book a Table Now' : 'Sign In to Book'}
              </button>
              <button 
                onClick={() => {
                  navigate(`/restaurant/${restaurant.id}`)
                  onClose()
                }}
                className="w-full py-3.5 bg-stone-100/80 text-stone-700 font-semibold rounded-2xl hover:bg-stone-200/80 transition-all"
              >
                View Full Details
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default SingleRestaurantPopup