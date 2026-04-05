import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import BookingDetailModal from '../components/BookingDetailModal'
import { useAuth } from '../context/AuthContext'
import { useReservationData } from '../context/ReservationDataContext'

const statusOrder = ['Upcoming', 'Completed', 'Cancelled']

function MyBookingsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    cancelRuntimeBooking,
    evaluateCancellationPolicy,
    getBookingsForUser,
    getRestaurantByBooking,
    hasFeedbackForBooking,
    getFeeds,
    hasRuntimeBooking,
    autoCancelExpiredBookings
  } = useReservationData()
  
  const [refreshTick, setRefreshTick] = useState(0)
  const [selectedBookingId, setSelectedBookingId] = useState(null)

  useEffect(() => {
    autoCancelExpiredBookings()
    setRefreshTick(prev => prev + 1)
  }, [])

  const bookings = useMemo(() => {
    if (!user?.id) return []
    return getBookingsForUser(user.id)
  }, [user?.id, refreshTick, getBookingsForUser])

  const grouped = useMemo(() => {
    const groups = {
      Upcoming: [],
      Completed: [],
      Cancelled: []
    }

    bookings.forEach((booking) => {
      if (booking.bookingStatus === 'Cancelled') {
        groups.Cancelled.push(booking)
      } else if (booking.bookingStatus === 'Completed') {
        groups.Completed.push(booking)
      } else {
        groups.Upcoming.push(booking)
      }
    })

    return groups
  }, [bookings])

  const selectedBooking = useMemo(() => {
    return bookings.find(b => b.id === selectedBookingId)
  }, [bookings, selectedBookingId])

  const selectedFeedback = useMemo(() => {
    if (!selectedBookingId) return null
    const feeds = getFeeds() || []
    return feeds.find(f => f.bookingId === selectedBookingId)
  }, [selectedBookingId, getFeeds])

  const handleBookingClick = (bookingId) => {
    setSelectedBookingId(bookingId)
  }

  const handleCloseModal = () => {
    setSelectedBookingId(null)
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const renderBookingListItem = (booking) => {
    const restaurant = getRestaurantByBooking(booking)
    const hasFeedback = hasFeedbackForBooking(booking.id)
    const paymentMethodSafe = String(booking.paymentMethod || '').toLowerCase()
    const isPayAtRestaurant = ['restaurant', 'cash', 'pay at restaurant'].includes(paymentMethodSafe)
    const paymentStatusSafe = String(booking.paymentStatus || '').toLowerCase()
    const paymentStateLabel = paymentStatusSafe === 'paid'
      ? 'Paid'
      : paymentStatusSafe === 'pending'
        ? 'Pending'
        : booking.paymentStatus
    const paymentStateClass = paymentStatusSafe === 'paid'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : paymentStatusSafe === 'pending'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-slate-100 text-slate-700 border-slate-200'

    return (
      <button
        key={booking.id}
        type="button"
        onClick={() => handleBookingClick(booking.id)}
        className="w-full text-left border border-brand-200 rounded-xl p-4 hover:bg-brand-50 hover:border-brand-400 transition-all group"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-black group-hover:text-brand-700 truncate">{restaurant?.name || booking.restaurantId}</h3>
            <p className="text-sm text-black/60 mt-1">
              {formatDate(booking.date)} at {booking.time}
            </p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${paymentStateClass}`}>
                {paymentStateLabel}
              </span>
              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${
                isPayAtRestaurant
                  ? 'bg-sky-50 text-sky-700 border-sky-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                {isPayAtRestaurant ? 'Pay at Restaurant' : 'Paid Online'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasFeedback && (
              <span className="inline-block px-2 py-1 rounded text-xs font-semibold whitespace-nowrap bg-green-50 text-green-700 border border-green-200">
                Reviewed
              </span>
            )}
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${
              booking.bookingStatus === 'Upcoming'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : booking.bookingStatus === 'Completed'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {booking.bookingStatus}
            </span>
            <span className="text-brand-600 group-hover:text-brand-700">→</span>
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-[#F2F2F0]">
      <Header />
      <main className="max-w-[960px] mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">My Bookings</h1>
            <p className="text-black/60 mt-1">Click on any booking to view details and submit feedback.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-brand-200 rounded-lg text-sm font-semibold hover:bg-brand-50"
          >
            Back to Home
          </button>
        </div>

        {/* Empty State */}
        {bookings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-brand-300 bg-white p-8 text-center">
            <p className="text-black/70 font-medium">No bookings found for this account yet.</p>
          </div>
        )}

        {/* Status-based Sections */}
        {statusOrder.map((status) => (
          <section key={status} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                status === 'Upcoming' ? 'bg-blue-500' : status === 'Completed' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <h2 className="text-xl font-bold text-black">{status}</h2>
              <span className="text-sm text-black/60">({grouped[status].length})</span>
            </div>
            {grouped[status].length === 0 ? (
              <p className="text-sm text-black/60 py-4">No {status.toLowerCase()} bookings.</p>
            ) : (
              <div className="space-y-3">
                {grouped[status].map(renderBookingListItem)}
              </div>
            )}
          </section>
        ))}
      </main>

      {/* Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          feedback={selectedFeedback}
          isOpen={!!selectedBookingId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default MyBookingsPage
