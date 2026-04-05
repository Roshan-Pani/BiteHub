import React from 'react'
import { useNavigate } from 'react-router-dom'

function AuthButton() {
  const navigate = useNavigate()

  return (
    <button 
      onClick={() => navigate('/login')}
      className="button-primary"
    >
      Sign In
    </button>
  )
}

export default AuthButton




