'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Feed from '@/components/Feed'
import AuthModal from '@/components/AuthModal'

export default function Home() {
  const { data: session, status } = useSession()
  const [isStaticDemo, setIsStaticDemo] = useState(false)

  // Detect if we're running on GitHub Pages (static demo)
  useEffect(() => {
    const isGitHubPages = window.location.hostname.includes('github.io')
    const isProduction = process.env.NODE_ENV === 'production'
    setIsStaticDemo(isGitHubPages && isProduction)
  }, [])

  // For static demo, skip authentication
  if (isStaticDemo) {
    return (
      <div className="min-h-screen bg-instagram-background">
        <Header />

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

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-instagram-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-instagram-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-instagram-text-light">Loading GitSocial...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <AuthModal isOpen={true} />
  }

  return (
    <div className="min-h-screen bg-instagram-background">
      <Header />

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
