import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useReservationData } from '../context/ReservationDataContext'
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
  const { resolveUserIdentity } = useReservationData()
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

    const identity = resolveUserIdentity({
      email: formData.email,
      name: formData.name,
      phone: formData.phone
    })

    const userData = {
      id: identity.id,
      isSeedUser: identity.isSeedUser,
      name: identity.name,
      email: identity.email,
      phone: identity.phone
    }
    
    login(userData)
    
    // Redirect to the page they tried to access or home
    const from = location.state?.from || '/'
    navigate(from, { replace: true })
  }

  return (
    <div className="app-shell flex items-center justify-center p-4">

      {/* Main Login Card */}
      <div className="relative w-full max-w-md">
        
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="login-logo">
            <div className="login-logo__mark">
              <span className="text-2xl">B</span>
            </div>
            <h1 className="login-title">BiteHub</h1>
          </div>
          <p className="text-black font-semibold">Your Gateway to Amazing Dining Experiences</p>
        </div>

        {/* Login/Register Card */}
        <div className="login-card">
          
          {/* Header Section */}
          <div className="p-8 pb-6">
            
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="login-card__icon">
                <svg className="w-9 h-9 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            
            {/* Title & Subtitle */}
            <div className="text-center mb-7">
              <h2 className="login-card__title">
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="login-card__subtitle">
                {isRegister ? 'Register to start booking amazing tables' : 'Sign in to continue your dining journey'}
              </p>
            </div>
            
            {/* Input Section - Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name Input (Register Only) */}
              {isRegister && (
                <div>
                  <label className="field-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={isRegister}
                    placeholder="Enter your full name"
                    className="field-input"
                  />
                </div>
              )}
              
              {/* Email Input */}
              <div>
                <label className="field-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="field-input"
                />
              </div>
              
              {/* Phone Input (Register Only) */}
              {isRegister && (
                <div>
                  <label className="field-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required={isRegister}
                    placeholder="10-digit mobile number"
                    pattern="[0-9]{10}"
                    className="field-input"
                  />
                </div>
              )}
              
              {/* Password Input */}
              <div>
                <label className="field-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  minLength="6"
                  className="field-input"
                />
              </div>
              
              {/* Forgot Password (Login Only) */}
              {!isRegister && (
                <div className="text-right">
                  <button
                    type="button"
                    className="login-link--small"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
              
              {/* Action Section - Primary Button */}
              <button
                type="submit"
                className="button-primary-block mt-6"
              >
                {isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>
            
            {/* Secondary Action - Toggle Sign In/Register */}
            <div className="mt-6 text-center">
              <p className="text-sm text-black">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
                {' '}
                <button
                  onClick={() => setIsRegister(!isRegister)}
                  className="login-link"
                >
                  {isRegister ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-black hover:text-black transition-colors font-semibold"
              >
                ← Back to Home
              </button>
            </div>
            
          </div>
          
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-sm text-black font-medium">
          <p>By continuing, you agree to BiteHub's Terms & Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage




