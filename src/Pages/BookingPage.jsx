import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../Components/Header'
import Tablechat from '../Components/Tablechat'
import { restaurants } from '../Data/restaurants'
import { getSeatsForSlot } from '../Data/tableunits'
import { useAuth } from '../context/AuthContext'
import { useReservationData } from '../context/ReservationDataContext'

const getDraftStorageKey = (restaurantId) => `booking-draft-${restaurantId}`

const getDefaultBookingDetails = () => ({
  date: '',
  time: '',
  guests: [],
  selectedTableIds: [],
  paymentMethod: 'card'
})

const readBookingDraft = (restaurantId) => {
  const fallback = getDefaultBookingDetails()

  try {
    const raw = sessionStorage.getItem(getDraftStorageKey(restaurantId))
    if (!raw) return fallback

    const parsed = JSON.parse(raw)
    return {
      ...fallback,
      ...parsed,
      guests: Array.isArray(parsed?.guests) ? parsed.guests : fallback.guests,
      selectedTableIds: Array.isArray(parsed?.selectedTableIds) ? parsed.selectedTableIds : fallback.selectedTableIds
    }
  } catch {
    return fallback
  }
}

const parseMeridianTime = (timeValue) => {
  if (!timeValue || typeof timeValue !== 'string') return 0
  const [clock, period] = timeValue.trim().split(' ')
  let [hours, minutes] = clock.split(':').map(Number)

  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0

  return (hours * 60) + minutes
}

const parseInputTime = (timeValue) => {
  if (!timeValue || !timeValue.includes(':')) return 0
  const [hours, minutes] = timeValue.split(':').map(Number)
  return (hours * 60) + minutes
}

const formatInputTime = (timeValue) => {
  if (!timeValue || !timeValue.includes(':')) return 'Not selected'
  const [hourRaw, minuteRaw] = timeValue.split(':').map(Number)
  const period = hourRaw >= 12 ? 'PM' : 'AM'
  const hour = hourRaw % 12 === 0 ? 12 : hourRaw % 12
  return `${hour}:${String(minuteRaw).padStart(2, '0')} ${period}`
}

const parseTimeParts = (timeValue) => {
  if (!timeValue || !timeValue.includes(':')) {
    return { hour12: '', minute: '', period: 'PM' }
  }

  const [hourRaw, minuteRaw] = timeValue.split(':').map(Number)
  if (Number.isNaN(hourRaw) || Number.isNaN(minuteRaw)) {
    return { hour12: '', minute: '', period: 'PM' }
  }

  const period = hourRaw >= 12 ? 'PM' : 'AM'
  const hour12 = hourRaw % 12 === 0 ? 12 : hourRaw % 12
  return {
    hour12: String(hour12).padStart(2, '0'),
    minute: String(minuteRaw).padStart(2, '0'),
    period
  }
}

const buildTimeFromParts = ({ hour12, minute, period }) => {
  if (!hour12 || !minute || !period) return ''

  let hours = Number(hour12)
  if (Number.isNaN(hours) || hours < 1 || hours > 12) return ''

  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0

  return `${String(hours).padStart(2, '0')}:${String(Number(minute)).padStart(2, '0')}`
}

function BookingPage() {
  const { restaurantId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createRuntimeBooking, upsertPaymentForBooking } = useReservationData()

  const restaurant = restaurants.find((record) => record.id === restaurantId)

  const [bookingDetails, setBookingDetails] = useState(() => readBookingDraft(restaurantId))

  const availableTableUnits = useMemo(() => {
    return getSeatsForSlot({
      restaurantId,
      date: bookingDetails.date,
      time: bookingDetails.time
    })
  }, [restaurantId, bookingDetails.date, bookingDetails.time])

  const [showGuestModal, setShowGuestModal] = useState(false)
  const [guestForm, setGuestForm] = useState({ name: '', age: '', foodPreference: '', sex: '' })
  const [guestFormError, setGuestFormError] = useState('')
  const [showProcessingModal, setShowProcessingModal] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [errors, setErrors] = useState({})
  const preserveDraftOnUnmountRef = useRef(false)

  const processingSteps = useMemo(() => {
    if (bookingDetails.paymentMethod === 'restaurant') {
      return [
        'Validating booking details...',
        'Checking seat availability...',
        'Locking reservation inventory...',
        'Booking confirmed for pay-at-restaurant...',
        'Redirecting to your dashboard...'
      ]
    }

    return [
      'Validating booking details...',
      'Checking seat availability...',
      'Connecting to demo payment gateway...',
      'Generating reservation token...',
      'Redirecting to your dashboard...'
    ]
  }, [bookingDetails.paymentMethod])

  useEffect(() => {
    if (!showProcessingModal) return

    if (processingStep >= processingSteps.length) {
      const timer = setTimeout(() => {
        sessionStorage.removeItem(getDraftStorageKey(restaurantId))
        navigate('/')
      }, 1200)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      setProcessingStep((step) => step + 1)
    }, 900)

    return () => clearTimeout(timer)
  }, [showProcessingModal, processingStep, processingSteps.length, navigate])

  useEffect(() => {
    const availableIds = new Set(
      availableTableUnits
        .filter((table) => table.status === 'Available')
        .map((table) => table.id)
    )

    setBookingDetails((prev) => {
      const filteredTableIds = prev.selectedTableIds.filter((id) => availableIds.has(id))
      if (filteredTableIds.length === prev.selectedTableIds.length) return prev
      return {
        ...prev,
        selectedTableIds: filteredTableIds
      }
    })
  }, [availableTableUnits])

  useEffect(() => {
    sessionStorage.setItem(getDraftStorageKey(restaurantId), JSON.stringify(bookingDetails))
  }, [restaurantId, bookingDetails])

  useEffect(() => {
    return () => {
      if (!preserveDraftOnUnmountRef.current) {
        sessionStorage.removeItem(getDraftStorageKey(restaurantId))
      }
      preserveDraftOnUnmountRef.current = false
    }
  }, [restaurantId])

  if (!restaurant) {
    navigate('/')
    return null
  }

  const openTimeMinutes = parseMeridianTime(restaurant.openingTime)
  const closeTimeMinutes = parseMeridianTime(restaurant.closingTime)

  const selectedSeats = availableTableUnits.filter((seat) => bookingDetails.selectedTableIds.includes(seat.id))
  const selectedSeatCount = bookingDetails.selectedTableIds.length

  const totalGuests = bookingDetails.guests.length
  const infantCount = bookingDetails.guests.filter((guest) => Number(guest.age) < 2).length
  const adultCount = bookingDetails.guests.filter((guest) => Number(guest.age) >= 18).length
  const seatRequiredGuests = bookingDetails.guests.filter((guest) => Number(guest.age) >= 2).length
  const childCount = bookingDetails.guests.filter((guest) => {
    const age = Number(guest.age)
    return age >= 2 && age < 18
  }).length

  const bookingBase = Math.ceil(300 * 0.6)
  const costPerSeat = Math.ceil(150 * 0.6)
  const subtotal = bookingBase + (selectedSeatCount * costPerSeat)
  const discount = Math.ceil(subtotal * 0.1)
  const total = Math.max(0, subtotal - discount)

  const isDateBookable = (dateValue) => {
    if (!dateValue) return true
    const selectedDate = new Date(dateValue)
    if (Number.isNaN(selectedDate.getTime())) return false

    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
    if ((restaurant.offDays || []).includes(dayName)) return false
    if ((restaurant.unavailableDates || []).includes(dateValue)) return false

    return true
  }

  const isTimeBookable = (timeValue) => {
    if (!timeValue) return false

    const selectedTime = parseInputTime(timeValue)
    if (closeTimeMinutes >= openTimeMinutes) {
      return selectedTime >= openTimeMinutes && selectedTime <= closeTimeMinutes
    }

    return selectedTime >= openTimeMinutes || selectedTime <= closeTimeMinutes
  }

  const toggleTableSelection = (tableId) => {
    setBookingDetails((prev) => {
      // Reset all selections if tableId is null
      if (tableId === null) {
        return {
          ...prev,
          selectedTableIds: []
        }
      }

      const exists = prev.selectedTableIds.includes(tableId)
      return {
        ...prev,
        selectedTableIds: exists
          ? prev.selectedTableIds.filter((id) => id !== tableId)
          : [...prev.selectedTableIds, tableId]
      }
    })
  }

  const timeParts = parseTimeParts(bookingDetails.time)

  const handleTimePartChange = (field, value) => {
    const nextParts = {
      ...timeParts,
      [field]: value
    }

    setBookingDetails((prev) => ({
      ...prev,
      time: buildTimeFromParts(nextParts)
    }))
  }

  const removeGuest = (guestId) => {
    setBookingDetails((prev) => ({
      ...prev,
      guests: prev.guests.filter((guest) => guest.id !== guestId)
    }))
  }

  const openGuestModal = () => {
    setGuestForm({ name: '', age: '', foodPreference: '', sex: '' })
    setGuestFormError('')
    setShowGuestModal(true)
  }

  const addGuestFromModal = () => {
    const trimmedName = guestForm.name.trim()
    const age = Number(guestForm.age)

    if (!trimmedName) {
      setGuestFormError('Guest name is required.')
      return
    }

    if (Number.isNaN(age) || age < 0 || age > 120) {
      setGuestFormError('Enter a valid age between 0 and 120.')
      return
    }

    if (age >= 2 && !guestForm.foodPreference) {
      setGuestFormError('Food preference is required for guests aged 2+ years.')
      return
    }

    if (age >= 13 && !guestForm.sex) {
      setGuestFormError('Sex selection is required for guests aged 13+ years.')
      return
    }

    setBookingDetails((prev) => ({
      ...prev,
      guests: [
        ...prev.guests,
        {
          id: Date.now(),
          name: trimmedName,
          age: String(age),
          foodPreference: age < 2 ? 'Infant' : guestForm.foodPreference,
          sex: guestForm.sex
        }
      ]
    }))

    setGuestFormError('')
    setShowGuestModal(false)
  }

  const validateBooking = () => {
    const validationErrors = {}

    if (!bookingDetails.date) validationErrors.date = 'Please select a booking date.'
    if (!isDateBookable(bookingDetails.date)) validationErrors.date = 'Restaurant is not serving on this date.'

    if (!bookingDetails.time) {
      validationErrors.time = 'Enter booking time.'
    } else if (!isTimeBookable(bookingDetails.time)) {
      validationErrors.time = `Time must be within ${restaurant.openingTime} - ${restaurant.closingTime}.`
    }

    if (bookingDetails.selectedTableIds.length === 0) {
      validationErrors.tables = 'Select at least one seat.'
    }

    if (bookingDetails.guests.length === 0) {
      validationErrors.guests = 'No guest entered. Please add at least one guest.'
    }

    if (seatRequiredGuests === 0 && bookingDetails.guests.length > 0) {
      validationErrors.guests = 'At least one non-infant guest is required for booking.'
    }

    if (adultCount === 0) {
      validationErrors.guests = 'At least one adult guest is required.'
    }

    if (infantCount > adultCount * 2) {
      validationErrors.guests = 'Each adult can accompany up to two infants in this demo flow.'
    }

    if (selectedSeatCount < seatRequiredGuests) {
      validationErrors.tables = `Select enough seats (need ${seatRequiredGuests} for non-infant guests, have ${selectedSeatCount} selected).`
    }

    bookingDetails.guests.forEach((guest, index) => {
      if (!guest.name.trim()) validationErrors[`guest-${index}-name`] = true
      if (Number(guest.age) >= 2 && !guest.foodPreference) validationErrors[`guest-${index}-food`] = true
      if (guest.age === '' || Number.isNaN(Number(guest.age)) || Number(guest.age) < 0) {
        validationErrors[`guest-${index}-age`] = true
      }
      if (Number(guest.age) >= 13 && !guest.sex) validationErrors[`guest-${index}-sex`] = true
    })

    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  const handleConfirmBooking = () => {
    if (!validateBooking()) return

    const bookingDate = new Date(`${bookingDetails.date}T${bookingDetails.time || '00:00'}`)
    const inferredStatus = Number.isNaN(bookingDate.getTime()) || bookingDate.getTime() > Date.now()
      ? 'Upcoming'
      : 'Completed'

    const bookingId = `BKG${Date.now()}`
    const bookingPayload = {
      id: bookingId,
      userId: user?.id || 'UNKNOWN',
      restaurantId: restaurant.id,
      restaurant,
      date: bookingDetails.date,
      time: bookingDetails.time,
      guests: bookingDetails.guests,
      selectedSeatIds: bookingDetails.selectedTableIds,
      seatNumbers: selectedSeats.map((seat) => seat.id),
      bookingDetails: {
        ...bookingDetails,
        selectedSeats
      },
      paymentMethod: bookingDetails.paymentMethod,
      paymentStatus: bookingDetails.paymentMethod === 'card' ? 'pending' : 'Pay at Restaurant',
      bookingStatus: inferredStatus,
      pricing: {
        bookingBase,
        costPerSeat,
        selectedSeatCount,
        subtotal,
        discount,
        total
      },
      createdBy: {
        id: user?.id,
        name: user?.name,
        email: user?.email
      },
      feedbackSubmitted: false,
      createdAt: new Date().toISOString()
    }

    createRuntimeBooking(bookingPayload)

    upsertPaymentForBooking({
      bookingId,
      userId: user?.id || 'UNKNOWN',
      restaurantId: restaurant.id,
      amount: total,
      method: bookingDetails.paymentMethod === 'card' ? 'Online' : 'Pay at Restaurant',
      status: bookingDetails.paymentMethod === 'card' ? 'Pending' : 'Pay at Restaurant',
      meta: {
        date: bookingDetails.date,
        time: bookingDetails.time,
        seatCount: selectedSeatCount
      }
    })

    // For online methods, create a booking record and continue to payment flow.
    if (bookingDetails.paymentMethod === 'card') {
      preserveDraftOnUnmountRef.current = true
      navigate(`/payment/${bookingId}`)
      return
    }

    setProcessingStep(0)
    setShowProcessingModal(true)
  }

  return (
    <div className="min-h-screen bg-[#F2F2F0]">
      <Header />

      <main className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="page-back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold text-black">Table Reservation Studio</h1>
            <p className="text-sm text-black/70 mt-1">
              {restaurant.name} | {restaurant.openingTime} - {restaurant.closingTime}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <section className="xl:col-span-4 space-y-6">
            <div className="surface-panel">
              <h2 className="text-lg font-bold text-black mb-4">When do you want to dine?</h2>
              <div className="space-y-4">
                <div>
                  <label className="field-label">Date</label>
                  <input
                    type="date"
                    value={bookingDetails.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(event) => setBookingDetails((prev) => ({ ...prev, date: event.target.value }))}
                    className={`field-input ${errors.date ? 'border-red-500' : ''}`}
                  />
                  {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
                </div>

                <div>
                  <label className="field-label">Time (with AM/PM)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={timeParts.hour12}
                      onChange={(event) => handleTimePartChange('hour12', event.target.value)}
                      className={`field-input ${errors.time ? 'border-red-500' : ''}`}
                    >
                      <option value="">Hour</option>
                      {Array.from({ length: 12 }, (_, index) => {
                        const value = String(index + 1).padStart(2, '0')
                        return <option key={value} value={value}>{value}</option>
                      })}
                    </select>

                    <select
                      value={timeParts.minute}
                      onChange={(event) => handleTimePartChange('minute', event.target.value)}
                      className={`field-input ${errors.time ? 'border-red-500' : ''}`}
                    >
                      <option value="">Min</option>
                      {Array.from({ length: 12 }, (_, index) => {
                        const value = String(index * 5).padStart(2, '0')
                        return <option key={value} value={value}>{value}</option>
                      })}
                    </select>

                    <select
                      value={timeParts.period}
                      onChange={(event) => handleTimePartChange('period', event.target.value)}
                      className={`field-input ${errors.time ? 'border-red-500' : ''}`}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  <p className="text-xs text-black/60 mt-1">
                    Allowed range: {restaurant.openingTime} to {restaurant.closingTime}
                  </p>
                  {errors.time && <p className="text-xs text-red-600 mt-1">{errors.time}</p>}
                </div>
              </div>
            </div>

            <div className="surface-panel">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-black">Guests</h2>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={openGuestModal}
                >
                  + Add Guest
                </button>
              </div>

              <div className="space-y-2">
                {bookingDetails.guests.length === 0 && (
                  <p className="text-sm text-black/60 border border-dashed border-brand-200 rounded-xl px-3 py-2 bg-white">
                    No user entered yet. Click Add Guest to continue.
                  </p>
                )}

                {bookingDetails.guests.map((guest, index) => (
                  <div key={guest.id} className="border border-brand-200 rounded-xl px-3 py-2 bg-white">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-black">
                        {guest.name || `Guest ${index + 1}`}
                      </p>
                      <button
                        type="button"
                        className="text-xs text-red-600 font-semibold"
                        onClick={() => removeGuest(guest.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-xs text-black/70 mt-0.5">
                      Age: {guest.age || '-'} | Food: {guest.foodPreference || '-'} | Sex: {guest.sex || '-'}
                    </p>
                  </div>
                ))}
              </div>

              {errors.guests && (
                <p className="text-xs text-red-600 mt-3 font-semibold">{errors.guests}</p>
              )}

              {infantCount > 0 && (
                <p className="text-xs text-blue-700 mt-3">
                  {infantCount} infant{infantCount > 1 ? 's are' : ' is'} included; separate seat not mandatory.
                </p>
              )}
              <p className="text-xs text-black/60 mt-1">
                Adults: {adultCount} | Children: {childCount} | Seat-requiring guests: {seatRequiredGuests}
              </p>
            </div>

            <div className="surface-panel">
              <h2 className="text-lg font-bold text-black mb-3">Payment Type</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3 border border-brand-200 rounded-xl p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={bookingDetails.paymentMethod === 'card'}
                    onChange={(event) => setBookingDetails((prev) => ({ ...prev, paymentMethod: event.target.value }))}
                  />
                  <span className="text-sm font-semibold text-black">Card / UPI (simulate online)</span>
                </label>
                <label className="flex items-center gap-3 border border-brand-200 rounded-xl p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="restaurant"
                    checked={bookingDetails.paymentMethod === 'restaurant'}
                    onChange={(event) => setBookingDetails((prev) => ({ ...prev, paymentMethod: event.target.value }))}
                  />
                  <span className="text-sm font-semibold text-black">Pay at Restaurant</span>
                </label>
              </div>
            </div>
          </section>

          <section className="xl:col-span-5">
            <Tablechat
              tableUnits={availableTableUnits}
              selectedTableIds={bookingDetails.selectedTableIds}
              onToggleTable={toggleTableSelection}
              requiredSeats={seatRequiredGuests}
            />
            {errors.tables && (
              <p className="text-sm text-red-600 mt-2 font-semibold">{errors.tables}</p>
            )}
          </section>

          <aside className="xl:col-span-3">
            <div className="surface-panel sticky top-24">
              <h2 className="text-lg font-bold text-black mb-4">Live Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/70">Restaurant</span>
                  <span className="font-semibold text-black text-right">{restaurant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/70">Date</span>
                  <span className="font-semibold text-black">{bookingDetails.date || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/70">Time</span>
                  <span className="font-semibold text-black">{formatInputTime(bookingDetails.time)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/70">Guests</span>
                  <span className="font-semibold text-black">{totalGuests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/70">Seat Requirement</span>
                  <span className="font-semibold text-black">{seatRequiredGuests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/70">Selected Seats</span>
                  <span className={`font-semibold ${selectedSeatCount >= seatRequiredGuests ? 'text-green-700' : 'text-red-600'}`}>
                    {selectedSeatCount}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-brand-200 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-black/70">Booking Base</span>
                  <span className="font-semibold text-black">₹{bookingBase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/70">Per Seat Cost</span>
                  <span className="font-semibold text-black">₹{costPerSeat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/70">Seats Selected</span>
                  <span className="font-semibold text-black">× {selectedSeatCount}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span className="font-semibold">-₹{discount}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-brand-200">
                  <span>Total</span>
                  <span className="text-black">₹{total}</span>
                </div>
              </div>

              <button
                type="button"
                className="button-primary-block mt-5"
                onClick={handleConfirmBooking}
              >
                {bookingDetails.paymentMethod === 'card' ? 'Continue to Payment' : 'Confirm Booking (Demo)'}
              </button>
              <p className="text-xs text-black/60 mt-2">
                {bookingDetails.paymentMethod === 'card'
                  ? 'Online flow: details and fake PIN confirmation on the payment page.'
                  : 'This is a simulation flow with animated fake processing.'}
              </p>
            </div>
          </aside>
        </div>
      </main>

      {showGuestModal && (
        <div className="modal-overlay" onClick={() => setShowGuestModal(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-lg font-bold text-black mb-4">Add Guest</h3>
              <div className="space-y-3">
                <div>
                  <label className="field-label">Name</label>
                  <input
                    type="text"
                    value={guestForm.name}
                    onChange={(event) => setGuestForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="field-input"
                  />
                </div>
                <div>
                  <label className="field-label">Age</label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={guestForm.age}
                    onChange={(event) => setGuestForm((prev) => ({ ...prev, age: event.target.value }))}
                    className="field-input"
                  />
                </div>
                <div>
                  <label className="field-label">Food Preference</label>
                  <select
                    value={guestForm.foodPreference}
                    onChange={(event) => setGuestForm((prev) => ({ ...prev, foodPreference: event.target.value }))}
                    className="field-input"
                  >
                    <option value="">Select</option>
                    <option value="Veg">Vegetarian</option>
                    <option value="Non-Veg">Non Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                  <p className="text-xs text-black/60 mt-1">Required for guests aged 2+ years.</p>
                </div>
                <div>
                  <label className="field-label">Sex</label>
                  <select
                    value={guestForm.sex}
                    onChange={(event) => setGuestForm((prev) => ({ ...prev, sex: event.target.value }))}
                    className="field-input"
                  >
                    <option value="">Not specified</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <p className="text-xs text-black/60 mt-1">Required for guests aged 13+ years.</p>
                </div>
              </div>
              {guestFormError && <p className="text-xs text-red-600 mt-3">{guestFormError}</p>}
              <div className="flex gap-2 mt-5">
                <button type="button" className="button-secondary" onClick={() => setShowGuestModal(false)}>
                  Cancel
                </button>
                <button type="button" className="button-primary" onClick={addGuestFromModal}>
                  Add Guest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProcessingModal && (
        <div className="modal-overlay">
          <div className="modal-card max-w-lg">
            <div className="p-6">
              <h3 className="text-xl font-bold text-black mb-4">Processing Reservation</h3>
              <div className="h-2 w-full rounded-full bg-brand-100/30 overflow-hidden mb-4">
                <div
                  className="h-full bg-accent-600 transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.round((processingStep / processingSteps.length) * 100))}%` }}
                />
              </div>
              <div className="space-y-3">
                {processingSteps.map((step, index) => {
                  const isDone = index < processingStep
                  const isActive = index === processingStep
                  return (
                    <div key={step} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isDone ? 'bg-green-500 border-green-500 text-white' : isActive ? 'border-accent-600 text-accent-600 animate-pulse' : 'border-brand-200 text-brand-200'}`}>
                        {isDone ? '✓' : index + 1}
                      </div>
                      <p className={`text-sm font-medium ${isDone || isActive ? 'text-black' : 'text-black/50'}`}>{step}</p>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-black/60 mt-5">Demo mode: no real payment is captured.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingPage
