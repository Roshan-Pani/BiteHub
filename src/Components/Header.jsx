import React from 'react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import SearchBar from './SearchBar'
import AuthButton from './AuthButton'
import ProfileButton from './ProfileButton'

function Header({ searchQuery, onSearchChange }) {
  const { isAuthenticated } = useAuth()
  
  return (
    <header className="site-header">
      <div className="page-container">
        <div className="site-header__inner">
          {/* Left Section: Logo */}
          <div className="site-header__brand">
            <Logo />
          </div>
          
          {/* Center Section: Search Bar */}
          <div className="search-shell">
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
            />
          </div>
          
          {/* Right Section: Auth & Profile */}
          <div className="header-actions">
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




