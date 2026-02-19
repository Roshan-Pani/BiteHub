import React from 'react'

function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400/90 to-orange-500/90 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">B</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-amber-600/90 to-orange-600/90 bg-clip-text text-transparent">
            BiteHub
          </span>
          <span className="text-[10px] text-stone-500 -mt-1">Dine Out</span>
        </div>
      </div>
      
      {/* Location Selector */}
      <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-stone-200">
        <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm font-medium text-stone-700">Bhubaneswar</span>
        <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

export default Logo
