'use client'

import { useState } from 'react'
import { Search, Heart, MessageCircle, PlusSquare, User, Home, Compass, LogOut } from 'lucide-react'
import { GitHubAuth } from '@/lib/github/GitHubAuth'

interface HeaderProps {
  user: any
  onLogout: () => void
}

export default function Header({ user, onLogout }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSignOut = async () => {
    try {
      const githubAuth = new GitHubAuth()
      githubAuth.logout()
      onLogout()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-instagram-border z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-instagram-primary via-instagram-secondary to-instagram-tertiary bg-clip-text text-transparent">
            GitSocial
          </h1>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-instagram-text-light w-4 h-4" />
            <input
              type="text"
              placeholder="Search users, posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-instagram-background border border-instagram-border rounded-lg text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {/* Navigation Icons */}
        <div className="flex items-center space-x-6">
          <button className="hover:scale-110 transition-transform">
            <Home className="w-6 h-6 text-instagram-text" />
          </button>
          <button className="hover:scale-110 transition-transform">
            <MessageCircle className="w-6 h-6 text-instagram-text" />
          </button>
          <button className="hover:scale-110 transition-transform">
            <PlusSquare className="w-6 h-6 text-instagram-text" />
          </button>
          <button className="hover:scale-110 transition-transform">
            <Compass className="w-6 h-6 text-instagram-text" />
          </button>
          <button className="hover:scale-110 transition-transform relative">
            <Heart className="w-6 h-6 text-instagram-text" />
            <span className="absolute -top-1 -right-1 bg-instagram-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>
          
          {/* Profile Menu */}
          <div className="relative group">
            <button className="hover:scale-110 transition-transform">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-instagram-primary object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-instagram-primary to-instagram-secondary rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white border border-instagram-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-2">
                <div className="px-3 py-2 border-b border-gray-100 mb-2">
                  <p className="font-semibold text-sm">{user?.name || user?.login}</p>
                  <p className="text-xs text-gray-500">@{user?.login}</p>
                  <p className="text-xs text-green-600 mt-1">Production GitSocial</p>
                </div>
                
                <button 
                  onClick={() => window.open(`https://github.com/${user?.login}/open-social-data`, '_blank')}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md text-sm"
                >
                  View My Data Repository
                </button>
                
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md text-sm">
                  Profile
                </button>
                
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md text-sm">
                  Settings
                </button>
                
                <hr className="my-1 border-instagram-border" />
                
                <button 
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md text-sm text-red-600 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}