import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useReservationData } from '../context/ReservationDataContext'

function ProfileButton() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { resetContext } = useReservationData()
  const [showMenu, setShowMenu] = useState(false)

  const handleResetContext = () => {
    if (window.confirm('This will clear all bookings, feedback, and payment data. Are you sure?')) {
      resetContext()
      setShowMenu(false)
      alert('Context has been reset successfully!')
    }
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="profile-button"
      >
        <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
          <div className="profile-menu">
            <div className="profile-menu__header">
              <p className="text-sm font-semibold text-brand-900">{user?.name || 'Guest User'}</p>
              <p className="text-xs text-brand-600 mt-0.5">{user?.email || 'guest@bitehub.com'}</p>
            </div>
            <button
              className="profile-menu__item"
              onClick={() => {
                navigate('/my-bookings')
                setShowMenu(false)
              }}
            >
              My Bookings
            </button>
            <button className="profile-menu__item">
              Settings
            </button>
            <button 
              onClick={handleResetContext}
              className="profile-menu__item"
              title="Clear all bookings and feedback data"
            >
              Reset Context
            </button>
            <button 
              onClick={() => {
                logout()
                setShowMenu(false)
              }}
              className="profile-menu__item--danger"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ProfileButton




