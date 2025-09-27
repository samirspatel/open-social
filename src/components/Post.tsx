'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Share, MoreHorizontal, GitBranch } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface PostProps {
  post: {
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
    repository: string
  }
  onLike: () => void
}

export default function Post({ post, onLike }: PostProps) {
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${post.author.name} on GitSocial`,
        text: post.content,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="card-instagram">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center space-x-3">
          <img 
            src={post.author.avatar} 
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-instagram-primary transition-colors"
          />
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-sm">{post.author.username}</span>
              <GitBranch className="w-3 h-3 text-instagram-text-light" />
            </div>
            <div className="flex items-center space-x-2 text-instagram-text-light text-xs">
              <span>{post.author.handle}</span>
              <span>¢</span>
              <span>{formatDistanceToNow(post.timestamp, { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        
        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5 text-instagram-text-light" />
        </button>
      </div>

      {/* Post Images */}
      {post.images.length > 0 && (
        <div className="aspect-square relative">
          <img 
            src={post.images[0]} 
            alt="Post content"
            className="w-full h-full object-cover"
          />
          {post.images.length > 1 && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
              1/{post.images.length}
            </div>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onLike}
              className="hover:scale-110 transition-transform group"
            >
              <Heart 
                className={`w-6 h-6 ${
                  post.isLiked 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-instagram-text hover:text-instagram-text-light'
                }`} 
              />
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="hover:scale-110 transition-transform"
            >
              <MessageCircle className="w-6 h-6 text-instagram-text hover:text-instagram-text-light" />
            </button>
            <button 
              onClick={handleShare}
              className="hover:scale-110 transition-transform"
            >
              <Share className="w-6 h-6 text-instagram-text hover:text-instagram-text-light" />
            </button>
          </div>
          
          <div className="text-xs text-instagram-text-light bg-gray-100 px-2 py-1 rounded-full">
            {post.repository}
          </div>
        </div>

        {/* Likes Count */}
        {post.likes > 0 && (
          <p className="font-semibold text-sm mb-2">
            {post.likes.toLocaleString()} {post.likes === 1 ? 'like' : 'likes'}
          </p>
        )}

        {/* Post Content */}
        <div className="text-sm">
          <span className="font-semibold mr-2">{post.author.username}</span>
          <span>{post.content}</span>
        </div>

        {/* Comments Count */}
        {post.comments > 0 && (
          <button 
            onClick={() => setShowComments(!showComments)}
            className="text-instagram-text-light text-sm mt-2 hover:text-instagram-text"
          >
            View all {post.comments} comments
          </button>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-instagram-border">
            <div className="space-y-3 mb-4">
              {/* Mock comments */}
              <div className="flex items-start space-x-3">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face" 
                  alt="Commenter"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-semibold mr-2">johndoe</span>
                    <span>This is amazing! </span>
                  </div>
                  <div className="text-xs text-instagram-text-light mt-1">
                    2h
                  </div>
                </div>
              </div>
            </div>
            
            {/* Add Comment */}
            <div className="flex items-center space-x-3">
              <img 
                src="https://github.com/identicons/currentuser.png" 
                alt="You"
                className="w-8 h-8 rounded-full object-cover"
              />
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 text-sm focus:outline-none"
              />
              {comment && (
                <button className="text-instagram-primary text-sm font-semibold">
                  Post
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
