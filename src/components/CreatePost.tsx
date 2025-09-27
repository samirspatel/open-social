'use client'

import { useState } from 'react'
import { Image, Smile, Calendar, MapPin, User } from 'lucide-react'

interface CreatePostProps {
  onPost: (content: string, images: string[]) => Promise<void>
  user: any
}

export default function CreatePost({ onPost, user }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isPosting, setIsPosting] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return

    setIsPosting(true)
    try {
      await onPost(content, images)
      setContent('')
      setImages([])
    } catch (error) {
      console.error('Error posting:', error)
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="card-instagram">
      <div className="flex items-start space-x-3 p-4">
        {/* Avatar */}
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt="Your profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-instagram-primary transition-colors"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-instagram-primary to-instagram-secondary flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        )}

        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's happening, ${user?.name?.split(' ')[0] || user?.login || 'there'}?`}
            className="w-full resize-none border-none focus:outline-none text-lg placeholder-instagram-text-light"
            rows={3}
          />

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="mt-3 space-y-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full max-h-80 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-70"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions Bar */}
      <div className="border-t border-instagram-border px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Media Options */}
          <div className="flex items-center space-x-4">
            <button className="text-instagram-primary hover:bg-instagram-primary hover:bg-opacity-10 p-2 rounded-full transition-colors">
              <Image className="w-5 h-5" />
            </button>
            <button className="text-instagram-secondary hover:bg-instagram-secondary hover:bg-opacity-10 p-2 rounded-full transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            <button className="text-instagram-tertiary hover:bg-instagram-tertiary hover:bg-opacity-10 p-2 rounded-full transition-colors">
              <Calendar className="w-5 h-5" />
            </button>
            <button className="text-instagram-text-light hover:bg-gray-100 p-2 rounded-full transition-colors">
              <MapPin className="w-5 h-5" />
            </button>
          </div>

          {/* Avatar Preview and Post Button */}
          <div className="flex items-center space-x-4">
            {/* Avatar Preview */}
            <div className="flex items-center space-x-2 mr-auto">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="Your profile"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-instagram-primary to-instagram-secondary flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
              )}
              <span className="text-sm font-medium">{user?.name || user?.login}</span>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                → GitHub
              </span>
            </div>

            {/* Character Count */}
            <div className="flex items-center space-x-3">
              {content.length > 0 && (
                <div className={`text-sm ${content.length > 280 ? 'text-red-500' : 'text-instagram-text-light'}`}>
                  {280 - content.length}
                </div>
              )}

              {/* Post Button */}
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || content.length > 280 || isPosting}
                className="bg-instagram-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-instagram-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPosting ? 'Posting...' : 'Post to GitHub'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}