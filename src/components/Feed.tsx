'use client'

import { useState, useEffect } from 'react'
import Post from './Post'
import CreatePost from './CreatePost'

// Mock data for demonstration
const mockPosts = [
  {
    id: '1',
    author: {
      username: 'alice',
      name: 'Alice Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e45132?w=150&h=150&fit=crop&crop=face',
      handle: '@alice.com'
    },
    content: 'Just shipped a new feature for our distributed social platform! 🚀 The future of social media is user-owned data.',
    images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop'],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 24,
    comments: 8,
    isLiked: false,
    repository: 'alice/social-data'
  },
  {
    id: '2',
    author: {
      username: 'bob',
      name: 'Bob Wilson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      handle: '@bob.com'
    },
    content: 'Beautiful sunset from my hike today! 🌅 Sometimes you need to disconnect from code and connect with nature.',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'],
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    likes: 89,
    comments: 12,
    isLiked: true,
    repository: 'bob/social-data'
  },
  {
    id: '3',
    author: {
      username: 'charlie',
      name: 'Charlie Davis',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      handle: '@charlie.dev'
    },
    content: 'Working on some exciting open source projects. Love how GitSocial lets me share updates directly from my repository! #opensource #gitsocial',
    images: [],
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    likes: 15,
    comments: 3,
    isLiked: false,
    repository: 'charlie/social-data'
  }
]

export default function Feed() {
  const [posts, setPosts] = useState(mockPosts)
  const [isLoading, setIsLoading] = useState(false)

  const handleNewPost = (content: string, images: string[]) => {
    const newPost = {
      id: Date.now().toString(),
      author: {
        username: 'currentuser',
        name: 'Current User',
        avatar: 'https://github.com/identicons/currentuser.png',
        handle: '@currentuser.com'
      },
      content,
      images,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      isLiked: false,
      repository: 'currentuser/social-data'
    }

    setPosts(prev => [newPost, ...prev])
  }

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        }
      }
      return post
    }))
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <CreatePost onPost={handleNewPost} />

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <Post 
            key={post.id} 
            post={post} 
            onLike={() => handleLike(post.id)}
          />
        ))}
      </div>

      {/* Loading More */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-instagram-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}
