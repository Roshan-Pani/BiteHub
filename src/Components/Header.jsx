import React from 'react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import SearchBar from './SearchBar'
import AuthButton from './AuthButton'
import ProfileButton from './ProfileButton'

function Header({ searchQuery, onSearchChange }) {
  const { isAuthenticated } = useAuth()
  
  return (
    <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-center justify-between h-[70px] gap-6">
          {/* Left Section: Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>
          
          {/* Center Section: Search Bar */}
          <div className="flex-1 max-w-xl">
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
            />
          </div>
          
          {/* Right Section: Auth & Profile */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {!isAuthenticated ? (
              <AuthButton />
            ) : (
              <ProfileButton />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header;
