'use client'

import { useState, useEffect } from 'react'
import CreatePost from './CreatePost'
import Post from './Post'
import { GitHubAPI } from '@/lib/github/GitHubAPI'

interface PostType {
  id: string
  author: {
    username: string
    name: string
    avatar: string
    handle: string
  }
  content: string
  images: string[]
  timestamp: Date
  likes: number
  comments: number
  isLiked: boolean
  mentions: string[]
  hashtags: string[]
}

interface FeedProps {
  user: any
}

export default function Feed({ user }: FeedProps) {
  const [posts, setPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const githubAPI = new GitHubAPI(user.token)
      
      // Get user's own posts
      const userPosts = await githubAPI.getUserPosts(user.login)
      
      // Transform GitHub API posts to our PostType format
      const transformedPosts = userPosts.map(post => ({
        id: post.id,
        author: {
          username: user.login,
          name: user.name || user.login,
          avatar: user.avatar_url,
          handle: `@${user.login}.github.io`
        },
        content: post.content,
        images: post.images || [],
        timestamp: new Date(post.createdAt),
        likes: (post.likes || []).length,
        comments: (post.comments || []).length,
        isLiked: false, // TODO: Check if current user liked this post
        mentions: post.mentions || [],
        hashtags: post.hashtags || []
      }))
      
      setPosts(transformedPosts)
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError('Failed to load posts from GitHub repository')
    } finally {
      setLoading(false)
    }
  }

  const handleNewPost = async (content: string, images: string[] = []) => {
    try {
      const githubAPI = new GitHubAPI(user.token)
      
      // Create post in user's repository
      const newPost = await githubAPI.createPost(user.login, content, images)
      
      // Transform and add to the beginning of the feed
      const transformedPost = {
        id: newPost.id,
        author: {
          username: user.login,
          name: user.name || user.login,
          avatar: user.avatar_url,
          handle: `@${user.login}.github.io`
        },
        content: newPost.content,
        images: newPost.images || [],
        timestamp: new Date(newPost.createdAt),
        likes: 0,
        comments: 0,
        isLiked: false,
        mentions: newPost.mentions || [],
        hashtags: newPost.hashtags || []
      }
      
      setPosts(prevPosts => [transformedPost, ...prevPosts])
    } catch (err) {
      console.error('Error creating post:', err)
      alert('Failed to create post in GitHub repository. Please check your token permissions.')
    }
  }

  const handleLikePost = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    )
  }

  useEffect(() => {
    if (user) {
      fetchPosts()
    }
  }, [user])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Production Status Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-green-900 mb-1">
              Production GitSocial Platform
            </h3>
            <p className="text-sm text-green-800">
              Your posts are stored in your GitHub repository: <strong>{user?.login}/open-social-data</strong>
            </p>
            <p className="text-xs text-green-600 mt-1">
              Real distributed social media - no servers, no data lock-in
            </p>
          </div>
        </div>
      </div>

      {/* Create Post */}
      <CreatePost onPost={handleNewPost} user={user} />

      {/* Loading State */}
      {loading && (
        <div className="bg-white border border-instagram-border rounded-lg p-8 text-center">
          <div className="w-8 h-8 border-2 border-instagram-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-instagram-text-light">Loading posts from your GitHub repository...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-semibold mb-2">Failed to load posts</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={fetchPosts}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {posts.length === 0 && !loading && !error && (
        <div className="bg-white border border-instagram-border rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-instagram-text-light">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Welcome to GitSocial!</h3>
          <p className="text-instagram-text-light mb-4">
            Create your first post to get started with distributed social media.
          </p>
          <div className="text-sm text-instagram-text-light">
            <p>Your posts will be stored in your GitHub repository:</p>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs mt-2 inline-block">
                {user?.login}/open-social-data
              </code>
          </div>
        </div>
      )}

      {/* Posts */}
      {posts.map(post => (
        <Post 
          key={post.id} 
          post={{
            ...post,
            repository: `${post.author.username}/open-social-data`
          }} 
          onLike={() => handleLikePost(post.id)} 
        />
      ))}
    </div>
  )
}