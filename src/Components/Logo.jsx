import React from 'react'

function Logo() {
  return (
    <div className="brand-logo">
      {/* Logo Icon */}
      <div className="flex items-center gap-2">
        <div className="brand-logo__mark">
          <span className="text-white font-bold text-xl">B</span>
        </div>
        <div className="flex flex-col">
          <span className="brand-logo__title">
            BiteHub
          </span>
          <span className="brand-logo__subtitle">Dine Out</span>
        </div>
      </div>
      
      {/* Location Selector */}
      <div className="brand-location">
        <svg className="brand-location__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="brand-location__text">Bhubaneswar</span>
        <svg className="brand-location__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

export default Logo




