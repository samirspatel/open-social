'use client'

import { useState } from 'react'
import { Github, Lock, Users } from 'lucide-react'
import { signIn } from 'next-auth/react'

interface AuthModalProps {
  isOpen: boolean
}

export default function AuthModal({ isOpen }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    try {
      await signIn('github', { callbackUrl: '/', redirect: true })
    } catch (error) {
      console.error('Sign in error:', error)
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="text-center p-8 border-b border-instagram-border">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-instagram-primary via-instagram-secondary to-instagram-tertiary rounded-full flex items-center justify-center">
            <Github className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-instagram-primary via-instagram-secondary to-instagram-tertiary bg-clip-text text-transparent mb-2">
            GitSocial
          </h1>
          <p className="text-instagram-text-light text-sm">
            Distributed social media powered by GitHub
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-instagram-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Own Your Data</h3>
                <p className="text-instagram-text-light text-xs">
                  Your posts, likes, and follows live in your GitHub repository
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-instagram-secondary mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Full Portability</h3>
                <p className="text-instagram-text-light text-xs">
                  Switch apps anytime without losing your connections
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Github className="w-5 h-5 text-instagram-tertiary mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">GitHub Integration</h3>
                <p className="text-instagram-text-light text-xs">
                  Seamlessly connects with your existing GitHub account
                </p>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-3 transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting to GitHub...</span>
              </>
            ) : (
              <>
                <Github className="w-5 h-5" />
                <span>Continue with GitHub</span>
              </>
            )}
          </button>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
            <h3 className="font-semibold text-blue-900 mb-2 text-xs">
              What happens when you sign in:
            </h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• We'll create an 'open-social-data' repository in your account</li>
              <li>• Your posts will be stored as JSON files with full history</li>
              <li>• You maintain complete ownership of your social data</li>
              <li>• Export or migrate your data anytime - no lock-in</li>
            </ul>
          </div>

          {/* Terms */}
          <p className="text-center text-instagram-text-light text-xs mt-4">
            By continuing, you agree to create a public repository for your social data
          </p>
        </div>
      </div>
    </div>
  )
}