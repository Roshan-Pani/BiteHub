import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import { getMenuStats } from '../data/restaurantMenuCatalog'
import { getRestaurantById, getRestaurantMenu } from '../services/restaurantApi'
import { getRestaurantFeedbackStats } from '../services/reservationApi'
import { parseMeridianTime } from '../../../shared/bookingRules.js'

const panelCards = [
  { key: 'photos', title: 'Photos' },
  { key: 'menu', title: 'Menu' },
  { key: 'reviews', title: 'Reviews' }
]

const isRestaurantOpenNow = (openingTime, closingTime) => {
  const open = parseMeridianTime(openingTime)
  const close = parseMeridianTime(closingTime)
  if (!open || !close) return true

  const now = new Date()
  const minutesNow = now.getHours() * 60 + now.getMinutes()
  const openMinutes = open.hours * 60 + open.minutes
  const closeMinutes = close.hours * 60 + close.minutes

  if (closeMinutes < openMinutes) {
    return minutesNow >= openMinutes || minutesNow <= closeMinutes
  }
  return minutesNow >= openMinutes && minutesNow <= closeMinutes
}

function DetailPanelModal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return undefined
    document.body.style.overflow = 'hidden'
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[230] bg-slate-950/55 backdrop-blur-sm p-4 flex items-center justify-center" onClick={onClose}>
      <div className="w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-[0_24px_64px_rgba(15,23,42,0.32)] overflow-hidden border border-slate-200" onClick={(event) => event.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            x
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-72px)]">
          {children}
        </div>
      </div>
    </div>
  )
}

function DetailedRestaurantPage() {
  const REVIEWS_BATCH_SIZE = 12
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [activePanel, setActivePanel] = useState(null)
  const [visibleReviewCount, setVisibleReviewCount] = useState(REVIEWS_BATCH_SIZE)
  const [restaurant, setRestaurant] = useState(null)
  const [detailedMenu, setDetailedMenu] = useState([])
  const [feedbackStats, setFeedbackStats] = useState({
    reviewCount: 0,
    averageRating: 0,
    allReviews: [],
    recentReviews: []
  })

  useEffect(() => {
    let mounted = true

    const loadRestaurant = async () => {
      try {
        const fetched = await getRestaurantById(id)
        if (mounted) setRestaurant(fetched || null)
      } catch {
        if (mounted) setRestaurant(null)
      }
    }

    loadRestaurant()

    return () => {
      mounted = false
    }
  }, [id])

  useEffect(() => {
    if (!restaurant) return

    let mounted = true

    const loadMenu = async () => {
      try {
        const menu = await getRestaurantMenu(restaurant.id)
        if (mounted) setDetailedMenu(Array.isArray(menu) ? menu : [])
      } catch {
        if (mounted) setDetailedMenu([])
      }
    }

    loadMenu()

    return () => {
      mounted = false
    }
  }, [restaurant])

  useEffect(() => {
    if (!restaurant?.id) return

    let mounted = true

    const loadStats = async () => {
      try {
        const stats = await getRestaurantFeedbackStats(restaurant.id)
        if (mounted && stats) {
          setFeedbackStats(stats)
        }
      } catch {
        if (mounted) {
          setFeedbackStats({
            reviewCount: 0,
            averageRating: 0,
            allReviews: [],
            recentReviews: []
          })
        }
      }
    }

    loadStats()

    return () => {
      mounted = false
    }
  }, [restaurant?.id])

  useEffect(() => {
    if (!restaurant) {
      navigate('/')
    }
  }, [restaurant, navigate])

  if (!restaurant) return null

  const displayRating = feedbackStats.reviewCount > 0 ? feedbackStats.averageRating : restaurant.rating
  const menuStats = useMemo(() => getMenuStats(detailedMenu), [detailedMenu])
  const allReviews = feedbackStats.allReviews || feedbackStats.recentReviews || []
  const visibleReviews = allReviews.slice(0, visibleReviewCount)
  const hasMoreReviews = visibleReviewCount < allReviews.length
  const openNow = isRestaurantOpenNow(restaurant.openingTime, restaurant.closingTime)

  useEffect(() => {
    if (activePanel === 'reviews') {
      setVisibleReviewCount(REVIEWS_BATCH_SIZE)
    }
  }, [activePanel])

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

  const handleImageError = (event, cuisineName) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = getFallbackImage(cuisineName)
  }

  const handleBookTable = () => {
    if (isAuthenticated) {
      navigate(`/booking/${restaurant.id}`)
      return
    }
    navigate('/login', { state: { from: `/booking/${restaurant.id}` } })
  }

  const reviewPreview = feedbackStats.recentReviews.slice(0, 2)

  return (
    <div className="min-h-screen bg-[#F2F2F0]">
      <Header />

      <section className="relative w-full h-96 bg-brand-900">
        <div className="absolute inset-0">
          <img
            src={restaurant.images?.[0] || getFallbackImage(restaurant.cuisine.name)}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            onError={(event) => handleImageError(event, restaurant.cuisine.name)}
          />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-6 h-full flex items-end pb-8">
          <div className="bg-white rounded-3xl shadow-md p-8 max-w-2xl w-full transform translate-y-12">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-black mb-2">{restaurant.name}</h1>
                <p className="text-black font-semibold mb-3">{restaurant.cuisine.name} • {restaurant.cuisine.description}</p>
                <div className="flex items-center gap-2 text-black">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="text-sm">{restaurant.location.specialIdentification}, {restaurant.location.city}</span>
                </div>
              </div>

              <div className="px-5 py-3 bg-accent-600 text-white text-xl font-bold rounded-2xl flex items-center gap-2 shadow-md">
                <span>{displayRating.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex gap-6 pt-4 border-t border-black">
              <div>
                <p className="text-xs font-bold text-black uppercase tracking-wide mb-1">Type</p>
                <p className="font-bold text-black">{restaurant.isVegOnly ? 'Pure Veg' : 'Veg & Non-Veg'}</p>
              </div>
              <div className="border-l border-black pl-6">
                <p className="text-xs font-bold text-black uppercase tracking-wide mb-1">Status</p>
                <p className="font-bold text-black">{openNow ? 'Open Now' : 'Closed'}</p>
              </div>
              <div className="border-l border-black pl-6">
                <p className="text-xs font-bold text-black uppercase tracking-wide mb-1">Timings</p>
                <p className="font-bold text-black">{restaurant.openingTime} - {restaurant.closingTime}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-[1280px] mx-auto px-6 mt-20">

        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <article className="bg-white rounded-2xl border border-brand-200 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-black/60">Cuisine</p>
            <p className="text-lg font-bold text-black mt-1">{restaurant.cuisine.name}</p>
            <p className="text-sm text-black/70 mt-2">{restaurant.cuisine.description}</p>
          </article>
          <article className="bg-white rounded-2xl border border-brand-200 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-black/60">Menu Depth</p>
            <p className="text-lg font-bold text-black mt-1">{menuStats.totalItems} items</p>
            <p className="text-sm text-black/70 mt-2">{menuStats.totalCategories} categories, avg Rs {menuStats.avgPrice}</p>
          </article>
          <article className="bg-white rounded-2xl border border-brand-200 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-black/60">Tables</p>
            <p className="text-lg font-bold text-black mt-1">{restaurant.tabledescription.tableTypesAvailable.length} types</p>
            <p className="text-sm text-black/70 mt-2">{restaurant.tabledescription.tableTypesAvailable.slice(0, 2).join(', ')}</p>
          </article>
          <article className="bg-white rounded-2xl border border-brand-200 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-black/60">Reviews</p>
            <p className="text-lg font-bold text-black mt-1">{displayRating.toFixed(1)} rating</p>
            <p className="text-sm text-black/70 mt-2">{feedbackStats.reviewCount} verified reviews</p>
          </article>
        </div>

        <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {panelCards.map((panel) => (
            <article key={panel.key} className="bg-white rounded-2xl border border-brand-200 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-black">{panel.title}</h2>
                <button
                  type="button"
                  onClick={() => setActivePanel(panel.key)}
                  className="text-sm px-3 py-1.5 rounded-lg border border-brand-300 hover:bg-brand-50 font-semibold text-brand-700"
                >
                  Open
                </button>
              </div>

              {panel.key === 'photos' && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {(restaurant.images || []).slice(0, 3).map((image) => (
                    <img
                      key={image}
                      src={image}
                      alt={`${restaurant.name} preview`}
                      className="h-20 w-full object-cover rounded-lg border border-brand-100"
                      onError={(event) => handleImageError(event, restaurant.cuisine.name)}
                    />
                  ))}
                </div>
              )}

              {panel.key === 'menu' && (
                <div className="mt-3 space-y-2">
                  {detailedMenu.slice(0, 3).map((category) => (
                    <p key={category.title} className="text-sm text-black/70">
                      {category.title}: <span className="font-semibold text-black">{category.items.length} items</span>
                    </p>
                  ))}
                </div>
              )}

              {panel.key === 'reviews' && (
                <div className="mt-3 space-y-2">
                  {reviewPreview.length === 0 && <p className="text-sm text-black/60">No reviews yet.</p>}
                  {reviewPreview.map((review) => (
                    <p key={review.id} className="text-sm text-black/70 line-clamp-2">
                      <span className="font-semibold text-black">{review.reviewerName}:</span> {review.review}
                    </p>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          <div className="lg:col-span-2 space-y-8">
            {restaurant.specialMessages && (
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-brand-200">
                <h2 className="text-xl font-bold text-black mb-4">Special Info</h2>
                <div className="p-4 bg-brand-50 rounded-xl border border-brand-200">
                  <p className="font-semibold text-black">{restaurant.specialMessages}</p>
                </div>
              </section>
            )}

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-brand-200">
              <h2 className="text-xl font-bold text-black mb-4">Cuisine and Features</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-black/70 uppercase tracking-wide mb-2">Service Days</p>
                  <p className="text-black font-semibold">{(restaurant.serviceDays || []).join(', ') || 'All days open'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-black/70 uppercase tracking-wide mb-2">Facilities</p>
                  <p className="text-black font-semibold">
                    {restaurant.hasAC ? 'AC Available' : 'Non-AC'} · {restaurant.tabledescription.tableTypesAvailable.join(', ')}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-brand-200">
              <h2 className="text-xl font-bold text-black mb-4">Location and Contact</h2>
              <p className="font-semibold text-black">{restaurant.location.specialIdentification}</p>
              <p className="text-sm text-black/70 mt-1">
                {restaurant.location.city}, {restaurant.location.state} - {restaurant.location.pin}
              </p>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-sm border border-brand-200">
              <h3 className="text-lg font-bold text-black mb-6">Reserve Your Table</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Select Date</label>
                  <div className="p-3 border border-black rounded-xl hover:border-black transition-colors cursor-pointer">
                    <span className="text-black font-semibold">Any upcoming service day</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Select Time</label>
                  <div className="p-3 border border-black rounded-xl hover:border-black transition-colors cursor-pointer">
                    <span className="text-black font-semibold">{restaurant.openingTime} to {restaurant.closingTime}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">Guests</label>
                  <div className="p-3 border border-brand-200 rounded-xl hover:border-brand-200 transition-colors cursor-pointer">
                    <span className="text-brand-600">Choose while booking</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-900 mb-2">Table Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {restaurant.tabledescription.tableTypesAvailable.slice(0, 2).map((type, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-xl text-center cursor-pointer ${
                          idx === 0 
                            ? 'border-2 border-brand-600 bg-brand-50' 
                            : 'border border-brand-200 hover:border-brand-600'
                        }`}
                      >
                        <p className={`text-sm font-semibold ${
                          idx === 0 ? 'text-brand-900' : 'text-brand-600'
                        }`}>{type}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-100">
                  <div className="flex justify-between mb-2">
                    <span className="text-brand-600">Avg Menu Price</span>
                    <span className="font-semibold">Rs {menuStats.avgPrice}</span>
                  </div>
                  <div className="flex justify-between text-brand-600 mb-2">
                    <span>Available Items</span>
                    <span className="font-semibold">{menuStats.availableItems}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total Menu Items</span>
                    <span className="text-brand-900">{menuStats.totalItems}</span>
                  </div>
                </div>

                <button
                  onClick={handleBookTable}
                  className="w-full py-4 bg-brand-200 text-brand-900 font-bold rounded-2xl hover:bg-brand-600 hover:text-white hover:shadow-lg transition-all"
                >
                  {isAuthenticated ? 'Book Table' : 'Sign In to Book'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      <DetailPanelModal isOpen={activePanel === 'photos'} onClose={() => setActivePanel(null)} title={`${restaurant.name} · Photos`}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(restaurant.images || []).map((image, index) => (
            <figure key={`${image}-${index}`} className="rounded-2xl overflow-hidden border border-brand-200 bg-white">
              <img
                src={image}
                alt={`${restaurant.name} photo ${index + 1}`}
                className="w-full h-56 object-cover"
                onError={(event) => handleImageError(event, restaurant.cuisine.name)}
              />
              <figcaption className="px-3 py-2 text-sm text-black/70">Photo {index + 1}</figcaption>
            </figure>
          ))}
        </div>
      </DetailPanelModal>

      <DetailPanelModal isOpen={activePanel === 'menu'} onClose={() => setActivePanel(null)} title={`${restaurant.name} · Detailed Menu`}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {detailedMenu.map((category) => (
            <section key={category.title} className="border border-brand-200 rounded-2xl p-4 bg-brand-50/20">
              <h4 className="text-lg font-bold text-black">{category.title}</h4>
              <p className="text-sm text-black/70 mt-1 mb-4">{category.description}</p>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <article key={item.name} className="bg-white border border-brand-100 rounded-xl p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-black">{item.name}</p>
                        <p className="text-sm text-black/70 mt-1">{item.description}</p>
                      </div>
                      <p className="font-bold text-brand-900 whitespace-nowrap">Rs {item.price}</p>
                    </div>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {item.tags.map((tag) => (
                        <span key={`${item.name}-${tag}`} className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {tag}
                        </span>
                      ))}
                      {!item.available && (
                        <span className="text-xs px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          Currently unavailable
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </DetailPanelModal>

      <DetailPanelModal isOpen={activePanel === 'reviews'} onClose={() => setActivePanel(null)} title={`${restaurant.name} · Guest Reviews`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <article className="bg-brand-50 border border-brand-200 rounded-xl p-4">
            <p className="text-sm text-black/60">Average Rating</p>
            <p className="text-3xl font-bold text-black mt-1">{displayRating.toFixed(1)}</p>
          </article>
          <article className="bg-brand-50 border border-brand-200 rounded-xl p-4">
            <p className="text-sm text-black/60">Total Reviews</p>
            <p className="text-3xl font-bold text-black mt-1">{feedbackStats.reviewCount}</p>
          </article>
          <article className="bg-brand-50 border border-brand-200 rounded-xl p-4">
            <p className="text-sm text-black/60">Recent Feedback</p>
            <p className="text-lg font-bold text-black mt-1">Live from diners</p>
          </article>
        </div>

        {allReviews.length === 0 ? (
          <p className="text-sm text-black/70">No reviews yet for this restaurant.</p>
        ) : (
          <div className="space-y-4">
            {visibleReviews.map((review) => (
              <article key={review.id} className="border border-brand-200 rounded-xl p-4 bg-white">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-black">{review.reviewerName}</p>
                  <p className="text-sm font-bold text-black">{review.rating.toFixed(1)} / 5</p>
                </div>
                <p className="text-sm text-black/80 mt-2">{review.review}</p>
              </article>
            ))}

            {hasMoreReviews && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setVisibleReviewCount((prev) => prev + REVIEWS_BATCH_SIZE)}
                  className="px-4 py-2 rounded-lg border border-brand-300 hover:bg-brand-50 font-semibold text-brand-700"
                >
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        )}
      </DetailPanelModal>
    </div>
  )
}

export default DetailedRestaurantPage




