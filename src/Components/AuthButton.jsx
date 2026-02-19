import React from 'react'
import { useNavigate } from 'react-router-dom'

function AuthButton() {
  const navigate = useNavigate()

  return (
    <button 
      onClick={() => navigate('/login')}
      className="px-5 py-2 bg-gradient-to-r from-amber-400/90 to-orange-400/90 text-white text-sm font-medium rounded-full hover:shadow-lg hover:from-amber-500/90 hover:to-orange-500/90 transition-all duration-200 whitespace-nowrap"
    >
      Sign In
    </button>
  )
}

export default AuthButton
