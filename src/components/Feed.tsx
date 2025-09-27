'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Post from './Post'
import CreatePost from './CreatePost'

interface PostType {
  id: string
  type: string
  content: string
  createdAt: string
  author: string
  media: string[]
  mentions: string[]
  hashtags: string[]
  signature: string
}

export default function Feed() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isStaticDemo, setIsStaticDemo] = useState(false)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      if (data.success) {
        setPosts(data.posts || [])
      } else {
        setError(data.error || 'Failed to load posts')
      }
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleNewPost = async (content: string, images: string[] = []) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          images,
          mentions: extractMentions(content),
          hashtags: extractHashtags(content)
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      const data = await response.json()
      if (data.success) {
        // Add the new post to the beginning of the feed
        setPosts(prevPosts => [data.post, ...prevPosts])
      } else {
        throw new Error(data.error || 'Failed to create post')
      }
    } catch (err) {
      console.error('Error creating post:', err)
      alert('Failed to create post. Please try again.')
    }
  }

  const extractMentions = (content: string): string[] => {
    const mentionRegex = /@(\w+)/g
    const mentions = []
    let match
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1])
    }
    return mentions
  }

  const extractHashtags = (content: string): string[] => {
    const hashtagRegex = /#(\w+)/g
    const hashtags = []
    let match
    while ((match = hashtagRegex.exec(content)) !== null) {
      hashtags.push(match[1])
    }
    return hashtags
  }

  useEffect(() => {
    if (session) {
      fetchPosts()
    }
  }, [session])

  // Detect if we're running on GitHub Pages (static demo)
  useEffect(() => {
    const isGitHubPages = window.location.hostname.includes('github.io')
    const isProduction = process.env.NODE_ENV === 'production'
    setIsStaticDemo(isGitHubPages && isProduction)
  }, [])

  if (!session && !isStaticDemo) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* GitHub Pages Info for static demo */}
      {isStaticDemo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                You&apos;re viewing the GitSocial Demo on GitHub Pages
              </h3>
              
              <div className="space-y-3 text-sm text-blue-800">
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Static Demo Mode</p>
                    <p>This version shows the UI and features but uses mock data for demonstration.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16.5c-.83 0-1.5.67-1.5 1.5v.5H9V8.5C9 7.67 8.33 7 7.5 7S6 7.67 6 8.5V10H4.5c-.83 0-1.5.67-1.5 1.5v8c0 .83.67 1.5 1.5 1.5H6v1.5c0 .83.67 1.5 1.5 1.5S9 23.33 9 22.5V21h6v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V21h1.5c.83 0 1.5-.67 1.5-1.5v-8c0-.83-.67-1.5-1.5-1.5H20z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Real GitSocial Network</p>
                    <p>For the full experience with real GitHub integration, run GitSocial locally or deploy to a server with authentication support.</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-200">
                <p className="text-xs text-blue-600">
                  <a 
                    href="https://github.com/samirpatel/open-social" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:underline font-medium"
                  >
                    View source code →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Post */}
      <CreatePost onPost={handleNewPost} />

      {/* Loading State */}
      {loading && (
        <div className="bg-white border border-instagram-border rounded-lg p-8 text-center">
          <div className="w-8 h-8 border-2 border-instagram-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-instagram-text-light">Loading your feed...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-white border border-instagram-border rounded-lg p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchPosts}
            className="btn-instagram"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && posts.length === 0 && (
        <div className="bg-white border border-instagram-border rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold text-instagram-text mb-2">Welcome to GitSocial!</h3>
          <p className="text-instagram-text-light mb-4">
            Start by creating your first post or following other users to see their content in your feed.
          </p>
          <div className="text-sm text-instagram-text-light">
            <p>Your posts will be stored in your GitHub repository:</p>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs mt-2 inline-block">
              {session.user?.name}/open-social-data
            </code>
          </div>
        </div>
      )}

      {/* Posts */}
      {!loading && !error && posts.map((post) => (
        <Post 
          key={post.id} 
          post={{
            id: post.id,
            author: {
              username: post.author,
              name: post.author,
              avatar: `https://github.com/${post.author}.png`,
              handle: `@${post.author}`
            },
            content: post.content,
            images: post.media || [],
            timestamp: new Date(post.createdAt),
            likes: 0, // TODO: Implement like counting
            comments: 0, // TODO: Implement comment counting
            isLiked: false, // TODO: Implement like status
            repository: `${post.author}/open-social-data`
          }}
          onLike={() => {
            // TODO: Implement like functionality
            console.log('Like post:', post.id)
          }}
        />
      ))}

      {/* Load More */}
      {!loading && !error && posts.length > 0 && (
        <div className="text-center py-8">
          <button 
            onClick={fetchPosts}
            className="text-instagram-primary hover:text-instagram-secondary font-semibold"
          >
            Refresh Feed
          </button>
        </div>
      )}
    </div>
  )
}