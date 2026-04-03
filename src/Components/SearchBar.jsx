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
        <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Search for restaurants, cuisines, location..."
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="search-clear"
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




