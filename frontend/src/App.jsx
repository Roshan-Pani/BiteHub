// Imports
import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ReservationDataProvider } from './context/ReservationDataContext'
import { purgeExpiredRuntimeData } from './services/runtimeDataLifecycleService'

// Pages
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import DetailedRestaurantPage from './Pages/DetailedRestaurantPage'
import BookingPage from './Pages/BookingPage'
import PaymentPage from './Pages/PaymentPage'
import FeedbackPage from './Pages/FeedbackPage'
import MyBookingsPage from './Pages/MyBookingsPage'

// Components
import ProtectedRoute from './Components/ProtectedRoute'

// Routes Configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/restaurant/:id",
    element: <DetailedRestaurantPage />
  },
  {
    path: "/booking/:restaurantId",
    element: (
      <ProtectedRoute>
        <BookingPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/payment/:bookingId",
    element: (
      <ProtectedRoute>
        <PaymentPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/feedback/:bookingId",
    element: (
      <ProtectedRoute>
        <FeedbackPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/my-bookings",
    element: (
      <ProtectedRoute>
        <MyBookingsPage />
      </ProtectedRoute>
    )
  }
])

// App Shell
function App() {
  useEffect(() => {
    purgeExpiredRuntimeData()
  }, [])

  return (
    <AuthProvider>
      <ReservationDataProvider>
        <RouterProvider router={router} />
      </ReservationDataProvider>
    </AuthProvider>
  )
}

// Exports
export default App




