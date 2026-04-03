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
        <div className="surface-panel--large inline-block">
          <div className="text-6xl mb-4">No Results</div>
          <h3 className="text-xl font-bold text-brand-900 mb-2">No Restaurants Found</h3>
          <p className="text-brand-600">Try adjusting your filters or search query</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-brand-900">Available Restaurants</h2>
        <p className="text-brand-600 mt-1">Showing {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}</p>
      </div>
      
      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            onClick={() => onRestaurantClick(restaurant)}
            className="restaurant-card group"
          >
            {/* Image Section */}
            <div className="restaurant-card__image">
              <img
                src={getFallbackImage(restaurant.cuisine.name)}
                alt={restaurant.name}
                className="restaurant-card__image-el group-hover:scale-110"
              />
              
              {/* Rating Badge */}
              <div className="hero-badge--rating">
                <span>{restaurant.rating.toFixed(1)}</span>
              </div>
              
              {/* Veg/Non-Veg Badge */}
              <div className="absolute top-3 left-3">
                {restaurant.isVegOnly ? (
                  <div className="hero-badge--pill">
                    Pure Veg
                  </div>
                ) : (
                  <div className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg shadow-md">
                     Non-Veg
                  </div>
                )}
              </div>
              
              {/* AC Badge */}
              {restaurant.hasAC && (
                <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-brand-200 text-brand-900 text-xs font-bold rounded-lg shadow-md">
                  AC
                </div>
              )}
            </div>
            
            {/* Content Section */}
            <div className="restaurant-card__content">
              {/* Restaurant Name */}
              <h3 className="restaurant-card__title">
                {restaurant.name}
              </h3>
              
              {/* Cuisine */}
              <p className="restaurant-card__meta">
                {restaurant.cuisine.name}
              </p>
              
              {/* Location */}
              <div className="flex items-start gap-1.5 mb-3">
                <svg className="w-4 h-4 text-brand-200 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs text-brand-600 line-clamp-1">
                  {restaurant.location.specialIdentification}, {restaurant.location.city}
                </span>
              </div>
              
              {/* Bottom Section */}
              <div className="restaurant-card__footer">
                <div>
                  <p className="text-xs text-brand-200">Timing</p>
                  <span className="text-sm font-semibold text-brand-900">
                    {restaurant.openingTime} - {restaurant.closingTime}
                  </span>
                </div>
                <button className="restaurant-card__action">
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




