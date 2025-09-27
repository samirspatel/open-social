'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Feed from '@/components/Feed'
import AuthModal from '@/components/AuthModal'
import { GitHubAuth } from '@/lib/github/GitHubAuth'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const githubAuth = new GitHubAuth()
        const userData = await githubAuth.getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.log('User not authenticated')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-instagram-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-instagram-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-instagram-text-light">Loading GitSocial...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthModal isOpen={true} onLogin={setUser} />
  }

  return (
    <div className="min-h-screen bg-instagram-background">
      <Header user={user} onLogout={() => setUser(null)} />

      <div className="flex max-w-6xl mx-auto pt-16">
        {/* Main Feed */}
        <div className="flex-1 max-w-2xl mx-auto px-4">
          <Feed user={user} />
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block w-80 p-4">
          <Sidebar user={user} />
        </div>
      </div>
    </div>
  )
}
