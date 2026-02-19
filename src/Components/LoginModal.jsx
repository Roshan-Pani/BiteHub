import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

function LoginModal({ onClose }) {
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })
  const { login } = useAuth()

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

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Mock authentication
    const userData = {
      name: formData.name || 'Guest User',
      email: formData.email,
      phone: formData.phone
    }
    
    login(userData)
    onClose()
  }

  return (
    /* Modal Overlay */
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-stone-100 hover:bg-stone-200 rounded-full flex items-center justify-center transition-all"
        >
          <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Modal Content */}
        <div className="max-h-[85vh] overflow-y-auto">
          
          {/* Header Section */}
          <div className="p-8">
            
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex items-center justify-center shadow-sm border border-amber-100">
                <svg className="w-9 h-9 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            
            {/* Title & Subtitle */}
            <div className="text-center mb-7">
              <h2 className="text-2xl font-bold text-stone-800 mb-2">
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-sm text-stone-500">
                {isRegister ? 'Register to start booking amazing tables' : 'Sign in to continue your dining journey'}
              </p>
            </div>
            
            {/* Input Section - Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name Input (Register Only) */}
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={isRegister}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-all"
                  />
                </div>
              )}
              
              {/* Email/Phone Input */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-all"
                />
              </div>
              
              {/* Phone Input (Register Only) */}
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wide">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required={isRegister}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-all"
                  />
                </div>
              )}
              
              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wide">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-all"
                />
              </div>
              
              {/* Forgot Password (Login Only) */}
              {!isRegister && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
              
              {/* Action Section - Primary Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 mt-6"
              >
                {isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>
            
            {/* Secondary Action - Toggle Sign In/Register */}
            <div className="mt-6 text-center">
              <p className="text-sm text-stone-500">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
                {' '}
                <button
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                >
                  {isRegister ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default LoginModal
