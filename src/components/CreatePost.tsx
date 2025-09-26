'use client'

import { useState, useRef } from 'react'
import { Camera, MapPin, Smile, X } from 'lucide-react'

interface CreatePostProps {
  onPost: (content: string, images: string[]) => void
}

export default function CreatePost({ onPost }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, e.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!content.trim() && images.length === 0) return
    
    onPost(content, images)
    setContent('')
    setImages([])
    setIsExpanded(false)
  }

  const canPost = content.trim().length > 0 || images.length > 0

  return (
    <div className="card-instagram">
      <div className="p-4">
        <div className="flex space-x-3">
          <img 
            src="https://github.com/identicons/currentuser.png" 
            alt="Your avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              placeholder="What's happening on your repositories?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="w-full resize-none border-none focus:outline-none text-sm placeholder-instagram-text-light"
              rows={isExpanded ? 3 : 1}
            />

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mt-3">
                <div className="grid grid-cols-2 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <img 
                        src={image} 
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isExpanded && (
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-instagram-border">
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 text-instagram-primary hover:bg-instagram-primary hover:bg-opacity-10 px-3 py-2 rounded-full transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span className="text-sm">Photo</span>
                  </button>
                  <button className="flex items-center space-x-2 text-instagram-text-light hover:bg-gray-100 px-3 py-2 rounded-full transition-colors">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Location</span>
                  </button>
                  <button className="flex items-center space-x-2 text-instagram-text-light hover:bg-gray-100 px-3 py-2 rounded-full transition-colors">
                    <Smile className="w-4 h-4" />
                    <span className="text-sm">Emoji</span>
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-sm text-instagram-text-light">
                    {content.length}/280
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={!canPost}
                    className={`px-6 py-2 rounded-full font-semibold text-sm transition-colors ${
                      canPost
                        ? 'bg-instagram-primary hover:bg-instagram-secondary text-white'
                        : 'bg-gray-200 text-instagram-text-light cursor-not-allowed'
                    }`}
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
