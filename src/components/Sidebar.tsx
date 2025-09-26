'use client'

import { GitFork, Star, Users, TrendingUp } from 'lucide-react'

export default function Sidebar() {
  // Mock data for suggestions
  const suggestedUsers = [
    {
      username: 'sarah_dev',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
      handle: '@sarah.dev',
      mutualFollows: 12,
      isFollowing: false
    },
    {
      username: 'mike_codes',
      name: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
      handle: '@mike.codes',
      mutualFollows: 8,
      isFollowing: false
    },
    {
      username: 'tech_jane',
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=80&h=80&fit=crop&crop=face',
      handle: '@jane.tech',
      mutualFollows: 15,
      isFollowing: true
    }
  ]

  const trendingTopics = [
    { tag: '#opensource', posts: '12.4K' },
    { tag: '#gitsocial', posts: '8.2K' },
    { tag: '#webdev', posts: '45.1K' },
    { tag: '#reactjs', posts: '32.7K' },
    { tag: '#typescript', posts: '28.3K' }
  ]

  const topRepositories = [
    { name: 'vercel/next.js', stars: '118k', language: 'TypeScript' },
    { name: 'facebook/react', stars: '220k', language: 'JavaScript' },
    { name: 'microsoft/vscode', stars: '156k', language: 'TypeScript' }
  ]

  return (
    <div className="space-y-6">
      {/* User Stats Card */}
      <div className="card-instagram p-4">
        <div className="flex items-center space-x-3 mb-4">
          <img 
            src="https://github.com/identicons/currentuser.png" 
            alt="Your avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">currentuser</h3>
            <p className="text-instagram-text-light text-sm">@currentuser.com</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-semibold">42</div>
            <div className="text-instagram-text-light text-xs">Posts</div>
          </div>
          <div>
            <div className="font-semibold">123</div>
            <div className="text-instagram-text-light text-xs">Following</div>
          </div>
          <div>
            <div className="font-semibold">89</div>
            <div className="text-instagram-text-light text-xs">Followers</div>
          </div>
        </div>
      </div>

      {/* Suggested Users */}
      <div className="card-instagram">
        <div className="p-4 pb-0">
          <h3 className="font-semibold flex items-center space-x-2 mb-4">
            <Users className="w-4 h-4" />
            <span>Suggested for you</span>
          </h3>
        </div>
        
        <div className="divide-y divide-instagram-border">
          {suggestedUsers.map((user) => (
            <div key={user.username} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-sm">{user.name}</div>
                  <div className="text-instagram-text-light text-xs">{user.handle}</div>
                  <div className="text-instagram-text-light text-xs">
                    {user.mutualFollows} mutual follows
                  </div>
                </div>
              </div>
              
              <button 
                className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors ${
                  user.isFollowing
                    ? 'btn-instagram-outline'
                    : 'btn-instagram'
                }`}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
        
        <div className="p-4 pt-0">
          <button className="text-instagram-primary text-sm font-semibold">
            See all suggestions
          </button>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="card-instagram">
        <div className="p-4 pb-0">
          <h3 className="font-semibold flex items-center space-x-2 mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>Trending</span>
          </h3>
        </div>
        
        <div className="divide-y divide-instagram-border">
          {trendingTopics.map((topic) => (
            <div key={topic.tag} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="font-semibold text-sm text-instagram-primary">{topic.tag}</div>
              <div className="text-instagram-text-light text-xs">{topic.posts} posts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Repositories */}
      <div className="card-instagram">
        <div className="p-4 pb-0">
          <h3 className="font-semibold flex items-center space-x-2 mb-4">
            <GitFork className="w-4 h-4" />
            <span>Popular Repositories</span>
          </h3>
        </div>
        
        <div className="divide-y divide-instagram-border">
          {topRepositories.map((repo) => (
            <div key={repo.name} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold text-sm">{repo.name}</div>
                <div className="flex items-center space-x-1 text-instagram-text-light text-xs">
                  <Star className="w-3 h-3" />
                  <span>{repo.stars}</span>
                </div>
              </div>
              <div className="text-instagram-text-light text-xs">{repo.language}</div>
            </div>
          ))}
        </div>
        
        <div className="p-4 pt-0">
          <button className="text-instagram-primary text-sm font-semibold">
            Explore repositories
          </button>
        </div>
      </div>
    </div>
  )
}
