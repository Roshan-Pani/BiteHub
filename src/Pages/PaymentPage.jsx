import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../Components/Header'

function PaymentPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()

  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })

  // Get booking details from localStorage
  const bookingData = JSON.parse(localStorage.getItem(`booking-${bookingId}`) || '{}')
  const totalAmount = bookingData.bookingDetails?.selectedSeats?.length * 450 || 770

  const handlePayment = (e) => {
    e.preventDefault()
    
    // Validate payment details
    if (!paymentDetails.cardNumber || !paymentDetails.cardName || 
        !paymentDetails.expiryDate || !paymentDetails.cvv) {
      alert('Please fill in all payment details')
      return
    }

    // Mock payment processing
    setTimeout(() => {
      // Mark booking as paid
      bookingData.paymentStatus = 'completed'
      bookingData.paidAt = new Date().toISOString()
      localStorage.setItem(`booking-${bookingId}`, JSON.stringify(bookingData))
      
      setPaymentCompleted(true)
    }, 1000)
  }

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-stone-50/30">
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-16">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-12 shadow-lg text-center">
            
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-stone-800 mb-4">Booking Confirmed!</h1>
            <p className="text-stone-600 mb-2">Your table has been successfully reserved</p>
            <p className="text-lg font-semibold text-amber-600 mb-8">Booking ID: {bookingId}</p>

            {/* Booking Details */}
            <div className="bg-stone-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-bold text-stone-800 mb-4">Reservation Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Restaurant</span>
                  <span className="font-semibold">{bookingData.restaurant?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Date</span>
                  <span className="font-semibold">{bookingData.bookingDetails?.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Time</span>
                  <span className="font-semibold">{bookingData.bookingDetails?.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Guests</span>
                  <span className="font-semibold">{bookingData.bookingDetails?.guests?.length}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-stone-200">
                  <span className="text-stone-600">Amount Paid</span>
                  <span className="font-bold text-green-600">₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 border-2 border-stone-300 text-stone-700 font-semibold rounded-xl hover:bg-stone-50 transition-all"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate(`/feedback/${bookingId}`)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-400/90 to-orange-500/90 text-white font-bold rounded-xl hover:shadow-xl hover:from-amber-500/90 hover:to-orange-600/90 transition-all"
              >
                ⭐ Share Feedback
              </button>
            </div>

            <p className="text-sm text-stone-500 mt-6">
              A confirmation email has been sent to your registered email address
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50/30">
      <Header />
      
      <main className="max-w-[1280px] mx-auto px-6 py-12">
        
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
          <h1 className="text-3xl font-bold text-stone-800">Complete Payment</h1>
          <p className="text-stone-600 mt-2">Secure payment gateway</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-lg">
              <h2 className="text-xl font-bold text-stone-800 mb-6">💳 Card Details</h2>
              
              <form onSubmit={handlePayment} className="space-y-6">
                
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                  />
                </div>

                {/* Card Holder Name */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Card Holder Name</label>
                  <input
                    type="text"
                    value={paymentDetails.cardName}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardName: e.target.value }))}
                    placeholder="Name on card"
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">CVV</label>
                    <input
                      type="password"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                      placeholder="123"
                      maxLength="3"
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                    />
                  </div>
                </div>

                {/* Security Note */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div>
                      <p className="text-sm text-green-800 font-semibold">Secure Payment</p>
                      <p className="text-sm text-green-700">Your payment information is encrypted and secure</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-amber-400/90 to-orange-500/90 text-white font-bold rounded-xl hover:shadow-xl hover:from-amber-500/90 hover:to-orange-600/90 transition-all"
                >
                  Pay ₹{totalAmount}
                </button>
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg sticky top-24">
              <h3 className="text-lg font-bold text-stone-800 mb-4">Order Summary</h3>
              
              {bookingData.restaurant && (
                <div className="mb-6 pb-4 border-b border-stone-200">
                  <p className="font-semibold text-stone-800">{bookingData.restaurant.name}</p>
                  <p className="text-sm text-stone-600">{bookingData.restaurant.location.city}</p>
                </div>
              )}
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-stone-600">
                  <span>Base Amount</span>
                  <span className="font-semibold">₹{bookingData.bookingDetails?.selectedSeats?.length * 500 || 800}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-semibold">-₹{bookingData.bookingDetails?.selectedSeats?.length * 50 || 80}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Taxes & Fees</span>
                  <span className="font-semibold">₹{bookingData.bookingDetails?.selectedSeats?.length * 0 || 50}</span>
                </div>
              </div>
              
              <div className="border-t border-stone-200 pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-amber-600">₹{totalAmount}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-6 pt-6 border-t border-stone-200">
                <p className="text-sm text-stone-600 mb-2">Payment Method</p>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="font-semibold text-stone-800">Credit / Debit Card</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  )
}

export default PaymentPage
