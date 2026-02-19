import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function ProfileButton() {
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="relative">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="w-10 h-10 bg-stone-100/80 rounded-full flex items-center justify-center hover:bg-stone-200/80 transition-colors"
      >
        <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
          <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-md border border-stone-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-100">
              <p className="text-sm font-semibold text-stone-800">{user?.name || 'Guest User'}</p>
              <p className="text-xs text-stone-500 mt-0.5">{user?.email || 'guest@bitehub.com'}</p>
            </div>
            <button className="w-full px-4 py-2.5 text-left text-sm text-stone-600 hover:bg-stone-50 transition-colors">
              My Bookings
            </button>
            <button className="w-full px-4 py-2.5 text-left text-sm text-stone-600 hover:bg-stone-50 transition-colors">
              Settings
            </button>
            <button 
              onClick={() => {
                logout()
                setShowMenu(false)
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-stone-100 mt-1"
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