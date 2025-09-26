// User types
export interface User {
  id: string
  login: string
  name: string
  email?: string
  avatar_url: string
  bio?: string
  location?: string
  website?: string
  twitter_username?: string
  public_repos: number
  followers: number
  following: number
  created_at: string
  handle: string // e.g., @username.com
  repository: string // GitHub repo containing social data
}

// Post types
export interface Post {
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
  reposts: number
  isLiked: boolean
  isReposted: boolean
  repository: string
  parentPost?: string // For replies
  mentions: string[]
  hashtags: string[]
}

// Comment types
export interface Comment {
  id: string
  postId: string
  author: {
    username: string
    name: string
    avatar: string
    handle: string
  }
  content: string
  timestamp: Date
  likes: number
  isLiked: boolean
  repository: string
  parentComment?: string // For nested replies
}

// Social connection types
export interface Following {
  handle: string
  repository: string
  followedAt: Date
  notifications: boolean
}

export interface Follower {
  handle: string
  repository: string
  followedAt: Date
}

// Repository data schemas
export interface ProfileSchema {
  version: string
  handle: string
  displayName: string
  bio?: string
  avatar?: string
  website?: string
  location?: string
  joinedAt: string
  publicKey: string
  verified: boolean
}

export interface PostSchema {
  id: string
  type: 'post' | 'reply' | 'repost'
  content: string
  createdAt: string
  author: string
  media: string[]
  replyTo?: string
  mentions: string[]
  hashtags: string[]
  signature: string
}

export interface SocialSchema {
  following: Following[]
  likes: {
    postId: string
    likedAt: string
  }[]
  reposts: {
    postId: string
    repostedAt: string
  }[]
}

// GitHub API types
export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  private: boolean
  owner: {
    login: string
    id: number
    avatar_url: string
  }
  description: string | null
  created_at: string
  updated_at: string
  clone_url: string
  default_branch: string
}

export interface GitHubFile {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string | null
  download_url: string | null
  type: 'file' | 'dir' | 'symlink' | 'submodule'
  content?: string
  encoding?: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Feed types
export interface FeedItem extends Post {
  feedType: 'post' | 'like' | 'follow' | 'repost'
  feedTimestamp: Date
}

// Notification types
export interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'repost'
  fromUser: {
    username: string
    name: string
    avatar: string
    handle: string
  }
  postId?: string
  timestamp: Date
  read: boolean
  message: string
}
