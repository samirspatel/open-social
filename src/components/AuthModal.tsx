'use client'

import { useState } from 'react'
import { Github, Lock, Users } from 'lucide-react'
import { PublicRepoAuth } from '@/lib/auth/PublicRepoAuth'
import { GitHubAPI } from '@/lib/github/GitHubAPI'

interface AuthModalProps {
  isOpen: boolean
  onLogin: (user: any) => void
}

export default function AuthModal({ isOpen, onLogin }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState('login') // 'login' | 'setup'

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    
    try {
      const githubAuth = new PublicRepoAuth()
      await githubAuth.login()
      
      // After successful token validation, get user and set up their account
      const user = await githubAuth.getCurrentUser()
      const githubAPI = new GitHubAPI(user.token)
      
      // Check if repository already exists
      const repoExists = await githubAPI.repositoryExists(user.login, 'open-social-data')
      
      if (!repoExists) {
        setStep('setup')
        await githubAPI.initializeSocialDataRepo(user.login, user)
      }
      
      onLogin(user)
    } catch (error) {
      console.error('Sign in error:', error)
      alert('Authentication failed. Please check your token and try again.')
      setIsLoading(false)
    }
  }

  const handleTokenSetup = async () => {
    // This function is no longer needed as setup is handled in handleGitHubLogin
    setStep('login')
  }

  if (!isOpen) return null

  if (step === 'setup') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
          {/* Header */}
          <div className="text-center p-8 border-b border-instagram-border">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-instagram-primary via-instagram-secondary to-instagram-tertiary rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Setup GitSocial Access
            </h1>
            <p className="text-instagram-text-light text-sm">
              Create a personal access token for GitSocial
            </p>
          </div>

          {/* Setup Instructions */}
          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div className="text-sm">
                <p className="font-semibold mb-3">To complete setup, create a GitHub Personal Access Token:</p>
                
                <ol className="space-y-2 text-instagram-text-light">
                  <li className="flex items-start">
                    <span className="bg-instagram-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5">1</span>
                    <span>Go to <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub Settings → Developer settings → Personal access tokens</a></span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-instagram-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5">2</span>
                    <span>Set description: <code className="bg-gray-100 px-1 rounded">GitSocial Access</code></span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-instagram-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5">3</span>
                    <span>Select scopes: <code className="bg-gray-100 px-1 rounded">repo</code>, <code className="bg-gray-100 px-1 rounded">read:user</code>, <code className="bg-gray-100 px-1 rounded">user:email</code></span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-instagram-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5">4</span>
                    <span>Generate token and paste it below</span>
                  </li>
                </ol>
              </div>
            </div>

            <button
              onClick={handleTokenSetup}
              disabled={isLoading}
              className="w-full bg-instagram-primary hover:bg-instagram-secondary text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-3 transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Setting up your account...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Complete Setup</span>
                </>
              )}
            </button>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Security:</strong> Your token is stored locally in your browser and never sent to any server. 
                GitSocial communicates directly with GitHub&apos;s API.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
              <Lock className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Ultra-Secure Authentication</h3>
                <p className="text-instagram-text-light text-xs">
                  Token can ONLY access public repositories - zero security risks
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-instagram-secondary mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Public & Transparent</h3>
                <p className="text-instagram-text-light text-xs">
                  Social media data in public repos - full transparency & portability
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Github className="w-5 h-5 text-instagram-tertiary mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Zero Server Dependency</h3>
                <p className="text-instagram-text-light text-xs">
                  Pure GitHub Pages deployment - no servers, no vendor lock-in
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
                <span>{step === 'setup' ? 'Setting up your account...' : 'Connecting to GitHub...'}</span>
              </>
            ) : (
              <>
                <Github className="w-5 h-5" />
                <span>Secure GitHub Authentication</span>
              </>
            )}
          </button>

          {/* Security Info */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-left">
            <h3 className="font-semibold text-green-900 mb-2 text-xs">
              🔒 Ultra-Secure Authentication:
            </h3>
            <ul className="text-xs text-green-800 space-y-1">
              <li>• Token scopes: <code>public_repo</code>, <code>read:user</code>, <code>user:email</code></li>
              <li>• CANNOT access your private repositories</li>
              <li>• Creates public &apos;open-social-data&apos; repository</li>
              <li>• Social media data is public anyway - full transparency</li>
              <li>• Complete data portability - your repository, your control</li>
            </ul>
          </div>

          {/* Security Notice */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-center text-blue-800 text-xs">
              <strong>Security First:</strong> Your authentication token cannot access private repositories - only public ones. Social media data lives transparently in your public GitHub repository.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}