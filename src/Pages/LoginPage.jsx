import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

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
    
    // Redirect to the page they tried to access or home
    const from = location.state?.from || '/'
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-md">
        
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🍽️</span>
            </div>
            <h1 className="text-3xl font-bold text-stone-800">BiteHub</h1>
          </div>
          <p className="text-stone-600">Your Gateway to Amazing Dining Experiences</p>
        </div>

        {/* Login/Register Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header Section */}
          <div className="p-8 pb-6">
            
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex items-center justify-center shadow-sm border border-amber-100">
                <svg className="w-9 h-9 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
              
              {/* Email Input */}
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
                    pattern="[0-9]{10}"
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
                  minLength="6"
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

            {/* Back to Home */}
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
              >
                ← Back to Home
              </button>
            </div>
            
          </div>
          
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-sm text-stone-600">
          <p>By continuing, you agree to BiteHub's Terms & Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
