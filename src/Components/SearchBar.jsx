import React from 'react'

function SearchBar({ searchQuery, onSearchChange }) {
  const handleChange = (e) => {
    onSearchChange(e.target.value)
  }

  const handleClear = () => {
    onSearchChange('')
  }

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <svg className="absolute left-4 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Search for restaurants, cuisines, location..."
          className="w-full pl-12 pr-10 py-2.5 bg-stone-50/50 border border-stone-200 rounded-full text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 w-5 h-5 text-stone-400 hover:text-stone-600"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar
