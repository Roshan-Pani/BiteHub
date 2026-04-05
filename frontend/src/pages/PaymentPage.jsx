import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useReservationData } from '../context/ReservationDataContext'

const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function PaymentPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { getBookingById, updateRuntimeBooking, upsertPaymentForBooking } = useReservationData()

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [paymentStep, setPaymentStep] = useState('details')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    pin: ''
  })

  const bookingData = getBookingById(bookingId) || {}
  const preserveDraftOnUnmountRef = useRef(false)

  const clearBookingDraft = () => {
    const id = bookingData.restaurantId || bookingData.restaurant?.id
    if (!id) return
    sessionStorage.removeItem(`booking-draft-${id}`)
  }

  useEffect(() => {
    return () => {
      if (!preserveDraftOnUnmountRef.current) {
        clearBookingDraft()
      }
      preserveDraftOnUnmountRef.current = false
    }
  }, [bookingData.restaurantId, bookingData.restaurant?.id])
  const selectedSeats = bookingData.bookingDetails?.selectedSeats?.length || 1
  const bookingBase = bookingData.pricing?.bookingBase ?? Math.ceil(300 * 0.6)
  const costPerSeat = bookingData.pricing?.costPerSeat ?? Math.ceil(150 * 0.6)
  const subtotal = bookingData.pricing?.subtotal ?? (bookingBase + (selectedSeats * costPerSeat))
  const discount = bookingData.pricing?.discount ?? Math.ceil(subtotal * 0.1)
  const totalAmount = bookingData.pricing?.total ?? Math.max(0, subtotal - discount)
  const processingSteps = ['Authorizing payment', 'Validating PIN', 'Confirming reservation', 'Redirecting to homepage']

  const handleContinueToPin = (e) => {
    e.preventDefault()

    if (paymentMethod === 'card') {
      const cleanCardNumber = paymentDetails.cardNumber.replace(/\s/g, '')
      const isCardValid =
        cleanCardNumber.length === 16 &&
        paymentDetails.cardName.trim().length > 1 &&
        paymentDetails.expiryDate.trim().length === 5 &&
        paymentDetails.cvv.length === 3

      if (!isCardValid) {
        alert('Please enter complete card details')
        return
      }
    }

    if (paymentMethod === 'upi') {
      const isUpiValid = paymentDetails.upiId.includes('@')
      if (!isUpiValid) {
        alert('Please enter a valid UPI ID')
        return
      }
    }

    setPaymentStep('pin')
  }

  const handleConfirmPayment = (e) => {
    e.preventDefault()

    if (paymentDetails.pin.length !== 4) {
      alert('Please enter a valid 4-digit PIN')
      return
    }

    const restaurantId = bookingData.restaurantId || bookingData.restaurant?.id

    setIsProcessing(true)
    setProcessingStep(0)

    const stepTimer = setInterval(() => {
      setProcessingStep((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(stepTimer)
          return prev
        }
        return prev + 1
      })
    }, 650)

    setTimeout(() => {
      updateRuntimeBooking(bookingId, (existing) => {
        const bookingDate = new Date(`${existing.date || bookingData.date}T${existing.time || bookingData.time || '00:00'}`)
        const derivedStatus = Number.isNaN(bookingDate.getTime()) || bookingDate.getTime() > Date.now()
          ? 'Upcoming'
          : 'Completed'

        return {
          paymentStatus: 'completed',
          paymentMethod,
          paidAt: new Date().toISOString(),
          bookingStatus: derivedStatus
        }
      })

      upsertPaymentForBooking({
        bookingId,
        userId: bookingData.userId,
        restaurantId,
        amount: totalAmount,
        method: paymentMethod.toUpperCase(),
        status: 'Completed',
        meta: {
          paidAt: new Date().toISOString()
        }
      })

      if (restaurantId) {
        sessionStorage.removeItem(`booking-draft-${restaurantId}`)
      }

      setIsProcessing(false)
      navigate('/')
    }, 2700)
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-[#F2F2F0]">
        <Header />
        <main className="max-w-xl mx-auto px-6 py-24 text-center">
          <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-black mb-2">Processing Payment</h2>
          <div className="bg-white rounded-2xl border border-brand-200 p-5 mt-5 text-left shadow-sm">
            {processingSteps.map((step, index) => {
              const done = index < processingStep
              const active = index === processingStep

              return (
                <div key={step} className="flex items-center gap-3 py-2">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${done ? 'bg-green-600 border-green-600 text-white' : active ? 'border-brand-600 text-brand-600' : 'border-brand-200 text-brand-300'}`}>
                    {done ? '✓' : index + 1}
                  </div>
                  <p className={`text-sm ${done || active ? 'text-black font-medium' : 'text-black/50'}`}>{step}</p>
                </div>
              )
            })}
          </div>
          <p className="text-xl font-bold text-brand-700 mt-4">Rs {totalAmount}</p>
          <p className="text-xs text-black/60 mt-2">Payment successful. Redirecting to homepage automatically.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F2F2F0]">
      <Header />
      <main className="max-w-[1180px] mx-auto px-6 py-12">
        <div className="mb-8">
          <button
            onClick={() => {
              preserveDraftOnUnmountRef.current = true
              navigate(-1)
            }}
            className="flex items-center gap-2 text-brand-600 hover:text-brand-900 mb-3 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-black">Complete Payment</h1>
          <p className="text-black/70 mt-2">Step 1: Details to Step 2: PIN to Step 3: Confirmation</p>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">Secure Checkout</span>
            <span className="px-2 py-1 rounded-full bg-brand-50 text-black/70 font-semibold">256-bit Encryption (Demo)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-md">
              <h2 className="text-xl font-bold text-black mb-5">
                {paymentStep === 'details' ? 'Choose Method and Enter Details' : 'Enter PIN to Confirm'}
              </h2>

              {paymentStep === 'details' && (
                <form onSubmit={handleContinueToPin} className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`rounded-xl border-2 px-4 py-4 text-left transition-all ${
                        paymentMethod === 'card'
                          ? 'border-brand-600 bg-brand-50'
                          : 'border-brand-200 hover:border-brand-400'
                      }`}
                    >
                      <p className="text-sm text-black/70">Method</p>
                      <p className="font-bold text-black">Card</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`rounded-xl border-2 px-4 py-4 text-left transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-brand-600 bg-brand-50'
                          : 'border-brand-200 hover:border-brand-400'
                      }`}
                    >
                      <p className="text-sm text-black/70">Method</p>
                      <p className="font-bold text-black">UPI</p>
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 rounded-xl border border-brand-200 p-5 bg-brand-50/40">
                      <div className="rounded-xl bg-gradient-to-r from-slate-700 to-slate-900 text-white p-4">
                        <p className="text-xs uppercase tracking-wide text-white/70">Demo Bank Card</p>
                        <p className="text-lg font-semibold mt-2">{paymentDetails.cardNumber || '0000 0000 0000 0000'}</p>
                        <div className="flex items-center justify-between mt-3 text-xs text-white/80">
                          <span>{paymentDetails.cardName || 'CARD HOLDER'}</span>
                          <span>{paymentDetails.expiryDate || 'MM/YY'}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Card Number</label>
                        <input
                          type="text"
                          value={paymentDetails.cardNumber}
                          onChange={(e) => setPaymentDetails((prev) => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                          placeholder="1234 5678 1234 5678"
                          className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-200/40"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">Card Holder Name</label>
                        <input
                          type="text"
                          value={paymentDetails.cardName}
                          onChange={(e) => setPaymentDetails((prev) => ({ ...prev, cardName: e.target.value }))}
                          placeholder="Name on card"
                          className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-200/40"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">Expiry</label>
                          <input
                            type="text"
                            value={paymentDetails.expiryDate}
                            onChange={(e) => setPaymentDetails((prev) => ({ ...prev, expiryDate: formatExpiry(e.target.value) }))}
                            placeholder="MM/YY"
                            maxLength="5"
                            className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-200/40"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">CVV</label>
                          <input
                            type="password"
                            value={paymentDetails.cvv}
                            onChange={(e) => setPaymentDetails((prev) => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                            placeholder="123"
                            maxLength="3"
                            className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-200/40"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="space-y-4 rounded-xl border border-brand-200 p-5 bg-brand-50/40">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <button type="button" className="border border-brand-200 rounded-lg py-2 font-semibold hover:bg-brand-50">GPay</button>
                        <button type="button" className="border border-brand-200 rounded-lg py-2 font-semibold hover:bg-brand-50">PhonePe</button>
                        <button type="button" className="border border-brand-200 rounded-lg py-2 font-semibold hover:bg-brand-50">Paytm</button>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-black mb-2">UPI ID</label>
                        <input
                          type="text"
                          value={paymentDetails.upiId}
                          onChange={(e) => setPaymentDetails((prev) => ({ ...prev, upiId: e.target.value }))}
                          placeholder="name@upi"
                          className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-200/40"
                        />
                      </div>
                      <p className="text-sm text-black/70">Demo flow: enter UPI ID, then enter PIN, then booking confirmed.</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700"
                  >
                    Continue to PIN
                  </button>
                </form>
              )}

              {paymentStep === 'pin' && (
                <form onSubmit={handleConfirmPayment} className="space-y-6">
                  <div className="rounded-xl border border-brand-200 p-5 bg-brand-50/40">
                    <p className="text-sm text-black/70 mb-4">
                      {paymentMethod === 'upi' ? 'UPI PIN Verification' : 'Card PIN Verification'}
                    </p>
                    <label className="block text-sm font-bold text-black mb-2">Enter 4-digit PIN</label>
                    <input
                      type="password"
                      value={paymentDetails.pin}
                      onChange={(e) => setPaymentDetails((prev) => ({ ...prev, pin: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                      placeholder="0000"
                      maxLength="4"
                      className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-200/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentStep('details')}
                      className="py-3 border-2 border-brand-200 rounded-xl text-black font-semibold hover:bg-brand-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700"
                    >
                      Pay Rs {totalAmount}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
              <h3 className="text-lg font-bold text-black mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-black/70">Restaurant</span>
                  <span className="font-semibold text-black">{bookingData.restaurant?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/70">Date</span>
                  <span className="font-semibold text-black">{bookingData.bookingDetails?.date || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/70">Time</span>
                  <span className="font-semibold text-black">{bookingData.bookingDetails?.time || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/70">Seats</span>
                  <span className="font-semibold text-black">{selectedSeats}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm border-t border-brand-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-black/70">Booking Base</span>
                  <span className="font-semibold text-black">Rs {bookingBase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/70">Per Seat Cost</span>
                  <span className="font-semibold text-black">Rs {costPerSeat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/70">Seats Selected</span>
                  <span className="font-semibold text-black">x {selectedSeats}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span className="font-semibold">-Rs {discount}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-brand-200 mt-2">
                  <span className="font-bold text-black">Total</span>
                  <span className="font-bold text-brand-700">Rs {totalAmount}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-brand-200">
                <p className="text-xs text-black/60 mb-1">Selected Method</p>
                <p className="font-bold text-black">{paymentMethod === 'upi' ? 'UPI' : 'Card'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PaymentPage




