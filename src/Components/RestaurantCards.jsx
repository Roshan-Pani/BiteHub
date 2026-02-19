import React from 'react'

function RestaurantCards({ restaurants, onRestaurantClick }) {
  // Fallback image for restaurants
  const getFallbackImage = (cuisineName) => {
    const cuisineImages = {
      'North Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
      'Mughlai': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500',
      'Chinese': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500',
      'Italian': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500',
      'Japanese': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500',
      'Korean': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500',
      'default': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'
    }
    return cuisineImages[cuisineName] || cuisineImages.default
  }

  if (restaurants.length === 0) {
    return (
      <div className="w-full py-16 text-center">
        <div className="inline-block p-8 bg-white/80 rounded-3xl shadow-sm">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-stone-800 mb-2">No Restaurants Found</h3>
          <p className="text-stone-500">Try adjusting your filters or search query</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-stone-800">Available Restaurants</h2>
        <p className="text-stone-500 mt-1">Showing {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}</p>
      </div>
      
      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            onClick={() => onRestaurantClick(restaurant)}
            className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={getFallbackImage(restaurant.cuisine.name)}
                alt={restaurant.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Rating Badge */}
              <div className="absolute top-3 right-3 px-3 py-1.5 bg-green-600/90 text-white text-sm font-semibold rounded-lg flex items-center gap-1 shadow-lg">
                <span>⭐</span>
                <span>{restaurant.rating.toFixed(1)}</span>
              </div>
              
              {/* Veg/Non-Veg Badge */}
              <div className="absolute top-3 left-3">
                {restaurant.isVegOnly ? (
                  <div className="px-3 py-1.5 bg-green-600/90 text-white text-xs font-bold rounded-lg shadow-md">
                    Pure Veg
                  </div>
                ) : (
                  <div className="px-3 py-1.5 bg-red-600/90 text-white text-xs font-bold rounded-lg shadow-md">
                     Non-Veg
                  </div>
                )}
              </div>
              
              {/* AC Badge */}
              {restaurant.hasAC && (
                <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-blue-500/80 backdrop-blur-sm text-white text-xs font-bold rounded-lg shadow-md">
                  AC
                </div>
              )}
            </div>
            
            {/* Content Section */}
            <div className="p-4">
              {/* Restaurant Name */}
              <h3 className="text-lg font-bold text-stone-800 mb-1 truncate">
                {restaurant.name}
              </h3>
              
              {/* Cuisine */}
              <p className="text-sm text-stone-500 mb-2 truncate">
                {restaurant.cuisine.name}
              </p>
              
              {/* Location */}
              <div className="flex items-start gap-1.5 mb-3">
                <svg className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs text-stone-500 line-clamp-1">
                  {restaurant.location.specialIdentification}, {restaurant.location.city}
                </span>
              </div>
              
              {/* Bottom Section */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <div>
                  <p className="text-xs text-stone-400">Timing</p>
                  <span className="text-sm font-semibold text-stone-700">
                    {restaurant.openingTime} - {restaurant.closingTime}
                  </span>
                </div>
                <button className="px-4 py-1.5 bg-amber-50/80 text-amber-700 text-sm font-semibold rounded-full hover:bg-amber-100/80 transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RestaurantCards
