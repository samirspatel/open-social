'use client'

import { TrendingUp, Users, Bookmark, Settings, Github } from 'lucide-react'

interface SidebarProps {
  user: any
}

export default function Sidebar({ user }: SidebarProps) {
  const trendingTopics = [
    { tag: '#OpenSocial', posts: '12.3K posts' },
    { tag: '#DistributedSocial', posts: '8.9K posts' },
    { tag: '#GitHubPages', posts: '6.2K posts' },
    { tag: '#DataOwnership', posts: '4.7K posts' },
    { tag: '#NoServers', posts: '3.1K posts' }
  ]

  const suggestedUsers = [
    { username: 'octocat', name: 'GitHub', avatar: 'https://avatars.githubusercontent.com/u/583231?v=4' },
    { username: 'torvalds', name: 'Linus Torvalds', avatar: 'https://avatars.githubusercontent.com/u/1024025?v=4' },
    { username: 'gaearon', name: 'Dan Abramov', avatar: 'https://avatars.githubusercontent.com/u/810438?v=4' }
  ]

  return (
    <div className="space-y-6">
      {/* User Profile Summary */}
      <div className="bg-white border border-instagram-border rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-4">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-instagram-primary"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-instagram-primary to-instagram-secondary flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user?.name?.charAt(0) || user?.login?.charAt(0) || 'U'}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg">{user?.name || user?.login}</h3>
            <p className="text-instagram-text-light text-sm">@{user?.login}</p>
            <p className="text-green-600 text-xs flex items-center space-x-1">
              <Github className="w-3 h-3" />
              <span>Production Account</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-bold text-lg">0</div>
            <div className="text-instagram-text-light text-xs">Posts</div>
          </div>
          <div>
            <div className="font-bold text-lg">0</div>
            <div className="text-instagram-text-light text-xs">Following</div>
          </div>
          <div>
            <div className="font-bold text-lg">0</div>
            <div className="text-instagram-text-light text-xs">Followers</div>
          </div>
        </div>
        
        {/* Repository Link */}
        <div className="mt-4 pt-4 border-t border-instagram-border">
          <button
            onClick={() => window.open(`https://github.com/${user?.login}/open-social-data`, '_blank')}
            className="w-full text-center py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors flex items-center justify-center space-x-2"
          >
            <Github className="w-4 h-4" />
            <span>View Data Repository</span>
          </button>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white border border-instagram-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-instagram-primary" />
          <h3 className="font-semibold">Trending in GitSocial</h3>
        </div>
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
              <div className="font-semibold text-sm">{topic.tag}</div>
              <div className="text-instagram-text-light text-xs">{topic.posts}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Users */}
      <div className="bg-white border border-instagram-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-instagram-secondary" />
          <h3 className="font-semibold">Who to follow</h3>
        </div>
        <div className="space-y-3">
          {suggestedUsers.map((suggestedUser, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={suggestedUser.avatar}
                  alt={suggestedUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-sm">{suggestedUser.name}</div>
                  <div className="text-instagram-text-light text-xs">@{suggestedUser.username}</div>
                </div>
              </div>
              <button className="bg-instagram-primary text-white px-4 py-1 rounded-full text-sm hover:bg-instagram-secondary transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
        <button className="text-instagram-primary text-sm mt-3 hover:text-instagram-secondary">
          Show more
        </button>
      </div>

      {/* Quick Links */}
      <div className="bg-white border border-instagram-border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Quick Links</h3>
        <div className="space-y-2">
          <a href="#" className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <Bookmark className="w-5 h-5 text-instagram-text-light" />
            <span className="text-sm">Bookmarks</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-instagram-text-light" />
            <span className="text-sm">Settings</span>
          </a>
          <a 
            href="https://github.com/samirpatel/open-social" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Github className="w-5 h-5 text-instagram-text-light" />
            <span className="text-sm">Source Code</span>
          </a>
        </div>
      </div>

      {/* GitSocial Info */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="text-center">
          <h3 className="font-semibold text-green-900 mb-2">GitSocial Production</h3>
          <p className="text-sm text-green-800 mb-3">
            Distributed social media powered by GitHub repositories
          </p>
          <div className="text-xs text-green-600 space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Zero server costs</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Complete data ownership</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Open source & transparent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}