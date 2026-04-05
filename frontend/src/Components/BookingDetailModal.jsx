import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useReservationData } from '../context/ReservationDataContext'

const formatTimeLabel = (rawTime) => {
  if (!rawTime || typeof rawTime !== 'string') return 'Not set'
  if (rawTime.includes('AM') || rawTime.includes('PM')) return rawTime
  if (!rawTime.includes(':')) return rawTime

  const [hourRaw, minuteRaw] = rawTime.split(':').map(Number)
  const period = hourRaw >= 12 ? 'PM' : 'AM'
  const hour = hourRaw % 12 === 0 ? 12 : hourRaw % 12
  return `${hour}:${String(minuteRaw).padStart(2, '0')} ${period}`
}

function BookingDetailModal({ booking, feedback, isOpen, onClose }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    cancelRuntimeBooking,
    evaluateCancellationPolicy,
    getRestaurantByBooking,
    hasRuntimeBooking,
    canSubmitFeedback
  } = useReservationData()

  const restaurant = useMemo(() => {
    return getRestaurantByBooking(booking)
  }, [booking])

  const seats = booking.seatNumbers || booking.selectedTables || booking.selectedSeatIds || []
  const feedbackGate = useMemo(() => {
    return canSubmitFeedback({ booking, userId: user?.id })
  }, [booking, user?.id])

  const isPayAtRestaurant = useMemo(() => {
    const method = String(booking.paymentMethod || '').toLowerCase()
    return method === 'restaurant' || method === 'cash' || method === 'pay at restaurant'
  }, [booking.paymentMethod])

  const canRetryPayment = useMemo(() => {
    return (
      booking.bookingStatus !== 'Cancelled' &&
      booking.paymentStatus?.toLowerCase() === 'pending'
    )
  }, [booking])

  const cancellationPolicy = useMemo(() => {
    return evaluateCancellationPolicy(booking)
  }, [booking])

  const canCancel = useMemo(() => {
    return (
      hasRuntimeBooking(booking.id) &&
      booking.bookingStatus === 'Upcoming'
    )
  }, [booking])

  const handleCancel = () => {
    if (!canCancel) return
    const policy = evaluateCancellationPolicy(booking)
    if (!policy.allowed) {
      alert(policy.reason)
      return
    }
    cancelRuntimeBooking(booking.id)
    onClose()
  }

  const handleRetryPayment = () => {
    navigate(`/payment/${booking.id}`)
    onClose()
  }

  const handleGiveFeedback = () => {
    navigate(`/feedback/${booking.id}`)
    onClose()
  }

  if (!isOpen) return null

  const attendanceLabel = booking.attended === true ? 'Attended' : booking.attended === false ? 'Absent' : 'Pending Confirmation'
  const attendanceClass = booking.attended === true
    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
    : booking.attended === false
      ? 'bg-rose-100 text-rose-800 border-rose-200'
      : 'bg-amber-100 text-amber-800 border-amber-200'
  const isCancelled = booking.bookingStatus === 'Cancelled'

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-slate-950/50 backdrop-blur-md p-4">
      <div className="w-[92vw] max-w-3xl max-h-[88vh] rounded-[24px] bg-white overflow-hidden flex flex-col shadow-[0_32px_80px_rgba(15,23,42,0.35)] border border-white/60">
        {/* Premium Header */}
        <div className="bg-[radial-gradient(circle_at_top_left,_#1e293b,_#0f172a_60%)] text-white px-8 py-6 flex items-center justify-between flex-shrink-0">
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight truncate">{restaurant?.name || booking.restaurantId}</h2>
            <p className="text-slate-300 text-sm mt-1">Booking {booking.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white text-3xl leading-none ml-4 flex-shrink-0 font-light transition-colors"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-7 space-y-5 bg-gradient-to-b from-white to-slate-50/40">
          {/* Status Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-4 py-2 rounded-full text-sm font-bold tracking-wide ${
              booking.bookingStatus === 'Upcoming'
                ? 'bg-blue-100 text-blue-900'
                : booking.bookingStatus === 'Completed'
                ? 'bg-green-100 text-green-900'
                : 'bg-red-100 text-red-900'
            }`}>
              {booking.bookingStatus}
            </span>
            <span className={`px-4 py-2 rounded-full border text-sm font-bold ${attendanceClass}`}>
              {attendanceLabel}
            </span>
            {feedback && (
              <span className="px-4 py-2 rounded-full text-sm font-bold bg-amber-100 text-amber-900">
                Reviewed
              </span>
            )}
          </div>

          {/* Date & Time - Premium Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 border border-blue-200/50">
              <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide mb-1">Date</p>
              <p className="text-base font-bold text-slate-900">{booking.date}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-3 border border-purple-200/50">
              <p className="text-sm text-purple-600 font-semibold uppercase tracking-wide mb-1">Time</p>
              <p className="text-base font-bold text-slate-900">{formatTimeLabel(booking.time)}</p>
            </div>
          </div>

          {/* Quick Info Row */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/50">
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide mb-1">Guests</p>
              <p className="text-lg font-bold text-slate-900">{booking.guests?.length || 0}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/50">
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide mb-1">Payment</p>
              <p className={`text-lg font-bold ${
                booking.paymentStatus?.toLowerCase() === 'paid' 
                  ? 'text-green-600' 
                  : booking.paymentStatus?.toLowerCase() === 'pending'
                  ? 'text-orange-600'
                  : 'text-blue-600'
              }`}>
                {booking.paymentStatus}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/50">
            <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide mb-2">Payment Responsibility</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                isPayAtRestaurant
                  ? 'bg-sky-50 text-sky-700 border-sky-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                {isPayAtRestaurant ? 'Restaurant-side payment booking' : 'Online payment booking'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                booking.paymentStatus?.toLowerCase() === 'pending'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {booking.paymentStatus?.toLowerCase() === 'pending'
                  ? (isPayAtRestaurant ? 'Not yet paid at restaurant' : 'Online payment pending')
                  : 'Payment completed'}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200"></div>

          {/* Guest & Details Section - Compact */}
          {booking.guests && booking.guests.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">Guests</p>
              <div className="max-h-24 overflow-y-auto bg-slate-50 rounded-lg p-2 border border-slate-200 space-y-1">
                {booking.guests.slice(0, 2).map((guest, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="font-semibold text-slate-900">{guest.name}</p>
                    <p className="text-slate-600">{guest.age}y, {guest.sex}, {guest.foodPreference}</p>
                  </div>
                ))}
                {booking.guests.length > 2 && (
                  <p className="text-sm text-slate-500 font-semibold">+{booking.guests.length - 2} more</p>
                )}
              </div>
            </div>
          )}

          {/* Price Highlight */}
          {booking.pricing && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200/50">
              <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wide mb-2">Amount</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">Rs {booking.pricing.total}</p>
              </div>
            </div>
          )}

          {/* Feedback Display */}
          {feedback && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-200/50">
              <p className="text-sm text-amber-700 font-semibold uppercase tracking-wide mb-2">Review</p>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors ${i < feedback.rating ? 'bg-amber-400' : 'bg-slate-300'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">{feedback.review}</p>
            </div>
          )}
        </div>

        {/* Premium Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 flex flex-col gap-2 flex-shrink-0">
          {!isCancelled && canRetryPayment && (
            <p className="text-xs text-slate-600">
              Pay now to move this booking from Pending Payment to the regular booking status list.
            </p>
          )}

          <div className="flex flex-wrap gap-3 justify-end">
          {!isCancelled && canRetryPayment && (
            <button
              type="button"
              onClick={handleRetryPayment}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
            >
              {isPayAtRestaurant ? 'Pay Now' : 'Retry Pay'}
            </button>
          )}

          {!isCancelled && canCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={!cancellationPolicy.allowed}
              title={cancellationPolicy.allowed ? 'Cancel booking' : cancellationPolicy.reason}
              className="px-4 py-2 border-2 border-red-300 bg-white hover:bg-red-50 text-red-600 text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}

          {!isCancelled && !feedback && (
            <button
              type="button"
              onClick={handleGiveFeedback}
              disabled={!feedbackGate.allowed}
              title={feedbackGate.allowed ? 'Submit feedback' : feedbackGate.reason}
              className="px-4 py-2 border-2 border-amber-300 bg-white hover:bg-amber-50 text-amber-700 text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-lg transition-colors"
          >
            Done
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingDetailModal
