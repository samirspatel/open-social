'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Feed from '@/components/Feed'
import AuthModal from '@/components/AuthModal'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated)

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true)
    setShowAuthModal(false)
    console.log('User logged in:', userData)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setShowAuthModal(true)
  }

  if (!isAuthenticated) {
    return (
      <AuthModal 
        isOpen={showAuthModal} 
        onLogin={handleLogin}
      />
    )
  }

  return (
    <div className="min-h-screen bg-instagram-background">
      <Header onLogout={handleLogout} />
      
      <div className="flex max-w-6xl mx-auto pt-16">
        {/* Main Feed */}
        <div className="flex-1 max-w-2xl mx-auto px-4">
          <Feed />
        </div>
        
        {/* Sidebar */}
        <div className="hidden lg:block w-80 p-4">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
