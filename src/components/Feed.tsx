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

  if (!session) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
              {session.user?.name}/social-data
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
            repository: `${post.author}/social-data`
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