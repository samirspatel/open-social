'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Camera, MapPin, Smile, X, Loader2 } from 'lucide-react'

interface CreatePostProps {
  onPost: (content: string, images: string[]) => Promise<void>
}

export default function CreatePost({ onPost }: CreatePostProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setImages(prev => [...prev, result])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim() || isPosting) return

    setIsPosting(true)
    
    try {
      await onPost(content, images)
      // Reset form after successful post
      setContent('')
      setImages([])
      setIsExpanded(false)
    } catch (error) {
      console.error('Error posting:', error)
      // Error is handled in the parent component
    } finally {
      setIsPosting(false)
    }
  }

  const handleFocus = () => {
    setIsExpanded(true)
  }

  const handleCancel = () => {
    setContent('')
    setImages([])
    setIsExpanded(false)
  }

  const characterCount = content.length
  const maxChars = 280
  const isOverLimit = characterCount > maxChars

  return (
    <div className="bg-white border border-instagram-border rounded-lg">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="p-4 border-b border-instagram-border flex items-center space-x-3">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt="Your avatar"
              className="w-10 h-10 rounded-full border-2 border-instagram-primary object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-instagram-primary to-instagram-secondary rounded-full"></div>
          )}
          <div>
            <h3 className="font-semibold text-instagram-text">
              {session?.user?.name || 'User'}
            </h3>
            <p className="text-xs text-instagram-text-light">
              Publishing to: {session?.user?.name}/open-social-data
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={handleFocus}
            placeholder="What's happening in your distributed world?"
            className="w-full resize-none border-0 focus:ring-0 text-lg placeholder-instagram-text-light"
            rows={isExpanded ? 4 : 2}
            maxLength={maxChars + 100} // Allow some overflow for warning
          />

          {/* Character Count */}
          {isExpanded && (
            <div className="text-right mt-2">
              <span className={`text-sm ${
                isOverLimit 
                  ? 'text-red-500' 
                  : characterCount > maxChars * 0.8 
                    ? 'text-yellow-500' 
                    : 'text-instagram-text-light'
              }`}>
                {characterCount}/{maxChars}
              </span>
            </div>
          )}

          {/* Images Preview */}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {isExpanded && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 text-instagram-primary hover:text-instagram-secondary"
                  disabled={isPosting}
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-sm">Photo</span>
                </button>
                
                <button
                  type="button"
                  className="flex items-center space-x-2 text-instagram-text-light hover:text-instagram-text"
                  disabled={isPosting}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm">Location</span>
                </button>
                
                <button
                  type="button"
                  className="flex items-center space-x-2 text-instagram-text-light hover:text-instagram-text"
                  disabled={isPosting}
                >
                  <Smile className="w-5 h-5" />
                  <span className="text-sm">Emoji</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-instagram-text-light hover:text-instagram-text transition-colors"
                  disabled={isPosting}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={!content.trim() || isPosting || isOverLimit}
                  className="btn-instagram flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <span>Post</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Quick Post Button */}
          {!isExpanded && content.trim() && (
            <div className="mt-4 text-right">
              <button
                type="submit"
                disabled={!content.trim() || isPosting || isOverLimit}
                className="btn-instagram"
              >
                Post
              </button>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />
      </form>
    </div>
  )
}