import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../Components/Header'

function FeedbackPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const [feedback, setFeedback] = useState({
    rating: 0,
    review: '',
    serviceRating: 0,
    foodRating: 0,
    ambianceRating: 0
  })

  const [hoveredStar, setHoveredStar] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  // Check if user is authenticated
  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate
    if (feedback.rating === 0) {
      alert('Please provide an overall rating')
      return
    }

    if (feedback.review.length > 500) {
      alert('Review must be less than 500 words')
      return
    }

    // Store feedback
    const feedbackData = {
      bookingId,
      userId: user.email,
      userName: user.name,
      ...feedback,
      submittedAt: new Date().toISOString()
    }

    // Save to localStorage (in production, this would be an API call)
    const existingFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]')
    existingFeedbacks.push(feedbackData)
    localStorage.setItem('feedbacks', JSON.stringify(existingFeedbacks))

    // Mark booking as feedback submitted
    const bookingKey = `booking-${bookingId}`
    const bookingData = JSON.parse(localStorage.getItem(bookingKey) || '{}')
    bookingData.feedbackSubmitted = true
    localStorage.setItem(bookingKey, JSON.stringify(bookingData))

    setSubmitted(true)
  }

  const StarRating = ({ value, onChange, label, hovered, onHover }) => (
    <div className="flex items-center gap-3">
      <span className="text-sm font-bold text-black w-28">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => onHover && onHover(star)}
            onMouseLeave={() => onHover && onHover(0)}
            className="transition-transform hover:scale-110"
          >
            <svg
              className={`w-8 h-8 ${
                star <= (hovered || value)
                  ? 'text-black fill-black'
                  : 'text-gray-300 fill-gray-300'
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
      <span className="text-sm text-black ml-2 font-medium">
        {value > 0 ? `${value}/5` : 'Not rated'}
      </span>
    </div>
  )

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F2F2F0]">
        <Header />
        <main className="max-w-2xl mx-auto px-6 py-16">
          <div className="bg-white  rounded-3xl p-12 shadow-md text-center">
            <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-black mb-4">Thank You for Your Feedback!</h1>
            <p className="text-black font-medium mb-8">
              Your review has been submitted successfully and will help other diners make informed decisions.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-accent-600 text-white font-bold rounded-xl hover:bg-brand-900 hover:text-white hover:shadow-lg transition-all"
            >
              Back to Home
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F2F2F0]">
      <Header />
      
      <main className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-black hover:text-black mb-4 transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-black">Share Your Experience</h1>
          <p className="text-black font-medium mt-2">Help others by sharing your dining experience</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white  rounded-3xl p-8 shadow-md space-y-8">
          
          {/* Overall Rating */}
          <div>
            <h2 className="text-xl font-bold text-black mb-4">Overall Rating *</h2>
            <StarRating
              value={feedback.rating}
              onChange={(val) => setFeedback(prev => ({ ...prev, rating: val }))}
              label="Overall"
              hovered={hoveredStar}
              onHover={setHoveredStar}
            />
          </div>

          {/* Detailed Ratings */}
          <div className="pt-6 border-t border-brand-200">
            <h2 className="text-xl font-bold text-black mb-4">Rate Specific Aspects</h2>
            <div className="space-y-4">
              <StarRating
                value={feedback.foodRating}
                onChange={(val) => setFeedback(prev => ({ ...prev, foodRating: val }))}
                label="Food Quality"
              />
              <StarRating
                value={feedback.serviceRating}
                onChange={(val) => setFeedback(prev => ({ ...prev, serviceRating: val }))}
                label="Service"
              />
              <StarRating
                value={feedback.ambianceRating}
                onChange={(val) => setFeedback(prev => ({ ...prev, ambianceRating: val }))}
                label="Ambiance"
              />
            </div>
          </div>

          {/* Written Review */}
          <div className="pt-6 border-t border-brand-200">
            <h2 className="text-xl font-bold text-black mb-2">Write Your Review</h2>
            <p className="text-sm text-black font-medium mb-4">Maximum 500 words</p>
            <textarea
              value={feedback.review}
              onChange={(e) => setFeedback(prev => ({ ...prev, review: e.target.value }))}
              placeholder="Share details of your experience..."
              maxLength={500}
              rows={6}
              className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-100/40 resize-none"
            />
            <div className="text-right text-sm text-black font-medium mt-2">
              {feedback.review.length} / 500 characters
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-blue-800 font-semibold mb-1">Important Information</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Feedback can only be submitted once per booking</li>
                  <li>• Only registered users can submit feedback</li>
                  <li>• Your review will be visible to other users</li>
                  <li>• The restaurant's rating will be updated after your submission</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-8 py-3 border-2 border-black text-black font-bold rounded-xl hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-accent-600 text-white font-bold rounded-xl hover:bg-brand-900 hover:text-white hover:shadow-lg transition-all"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default FeedbackPage




