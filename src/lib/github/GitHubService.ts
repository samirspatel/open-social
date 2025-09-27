import { Octokit } from '@octokit/rest'
import type { GitHubRepository, GitHubFile } from '@/types'

export interface UserProfile {
  name: string
  email: string
  avatar: string
  githubId: string
  handle: string
}

export interface PostData {
  id: string
  content: string
  images?: string[]
  mentions?: string[]
  hashtags?: string[]
  timestamp: string
}

export class GitHubService {
  private octokit: Octokit

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    })
  }

  async getRepository(owner: string, repo: string) {
    try {
      const { data } = await this.octokit.rest.repos.get({
        owner,
        repo
      })

      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: 'Repository not found'
      }
    }
  }

  async createSocialDataRepository(username: string) {
    try {
      const { data } = await this.octokit.rest.repos.createForAuthenticatedUser({
        name: 'open-social-data',
        description: `${username}'s distributed social media data repository`,
        private: false,
        has_issues: false,
        has_projects: false,
        has_wiki: false,
        auto_init: false
      })

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Error creating repository:', error)
      return {
        success: false,
        error: 'Failed to create repository'
      }
    }
  }

  async initializeSocialDataRepository(username: string, profile: UserProfile) {
    try {
      // Create initial directory structure and files
      const files = [
        {
          path: '.gitsocial/config.json',
          content: JSON.stringify({
            version: '1.0.0',
            schemaVersion: '1.0',
            appUrl: 'https://gitsocial.io',
            createdAt: new Date().toISOString()
          }, null, 2)
        },
        {
          path: 'profile.json',
          content: JSON.stringify({
            version: '1.0',
            handle: profile.handle,
            displayName: profile.name,
            bio: '',
            avatar: profile.avatar,
            website: '',
            location: '',
            joinedAt: new Date().toISOString(),
            githubId: profile.githubId,
            verified: true
          }, null, 2)
        },
        {
          path: 'social/following.json',
          content: JSON.stringify({
            following: []
          }, null, 2)
        },
        {
          path: 'social/followers.json',
          content: JSON.stringify({
            followers: []
          }, null, 2)
        },
        {
          path: 'social/likes.json',
          content: JSON.stringify({
            likes: []
          }, null, 2)
        },
        {
          path: 'posts/README.md',
          content: '# Posts\n\nThis directory contains all posts as JSON files organized by date.'
        },
        {
          path: 'media/README.md',
          content: '# Media\n\nThis directory contains uploaded media files.'
        }
      ]

      // Create each file
      for (const file of files) {
        await this.octokit.rest.repos.createOrUpdateFileContents({
          owner: username,
          repo: 'open-social-data',
          path: file.path,
          message: `Initialize ${file.path}`,
          content: Buffer.from(file.content).toString('base64')
        })
      }

      return { success: true }
    } catch (error) {
      console.error('Error initializing repository:', error)
      return {
        success: false,
        error: 'Failed to initialize repository'
      }
    }
  }

  async createPost(username: string, postData: PostData) {
    try {
      const date = new Date()
      const dateStr = date.toISOString().split('T')[0]
      const timestamp = date.getTime()
      const filename = `posts/${dateStr}-${timestamp}.json`

      const postContent = {
        id: postData.id,
        type: 'post',
        content: postData.content,
        createdAt: postData.timestamp,
        author: username,
        media: postData.images || [],
        mentions: postData.mentions || [],
        hashtags: postData.hashtags || [],
        signature: '' // TODO: Add cryptographic signature
      }

      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: username,
        repo: 'open-social-data',
        path: filename,
        message: `Add new post: ${postData.id}`,
        content: Buffer.from(JSON.stringify(postContent, null, 2)).toString('base64')
      })

      return {
        success: true,
        filename,
        content: postContent
      }
    } catch (error) {
      console.error('Error creating post:', error)
      return {
        success: false,
        error: 'Failed to create post'
      }
    }
  }

  async followUser(username: string, targetUser: string, targetHandle: string) {
    try {
      // Get current following list
      const followingResult = await this.getFileContent(username, 'open-social-data', 'social/following.json')
      
      if (!followingResult.success) {
        throw new Error('Failed to get following list')
      }

      const followingData = JSON.parse(
        Buffer.from((followingResult.data as any).content!, 'base64').toString()
      )

      // Add new follow if not already following
      const alreadyFollowing = followingData.following.find(
        (f: any) => f.handle === targetHandle
      )

      if (!alreadyFollowing) {
        followingData.following.push({
          handle: targetHandle,
          repository: `${targetUser}/open-social-data`,
          followedAt: new Date().toISOString()
        })

        // Update following.json
        await this.octokit.rest.repos.createOrUpdateFileContents({
          owner: username,
          repo: 'open-social-data',
          path: 'social/following.json',
          message: `Follow ${targetHandle}`,
          content: Buffer.from(JSON.stringify(followingData, null, 2)).toString('base64'),
          sha: followingResult.data!.sha
        })
      }

      return { success: true }
    } catch (error) {
      console.error('Error following user:', error)
      return {
        success: false,
        error: 'Failed to follow user'
      }
    }
  }

  async addFollower(username: string, followerUser: string, followerHandle: string) {
    try {
      // Get current followers list
      const followersResult = await this.getFileContent(username, 'open-social-data', 'social/followers.json')
      
      if (!followersResult.success) {
        throw new Error('Failed to get followers list')
      }

      const followersData = JSON.parse(
        Buffer.from((followersResult.data as any).content!, 'base64').toString()
      )

      // Add new follower if not already in list
      const alreadyFollower = followersData.followers.find(
        (f: any) => f.handle === followerHandle
      )

      if (!alreadyFollower) {
        followersData.followers.push({
          handle: followerHandle,
          repository: `${followerUser}/open-social-data`,
          followedAt: new Date().toISOString()
        })

        // Update followers.json
        await this.octokit.rest.repos.createOrUpdateFileContents({
          owner: username,
          repo: 'open-social-data',
          path: 'social/followers.json',
          message: `Add follower ${followerHandle}`,
          content: Buffer.from(JSON.stringify(followersData, null, 2)).toString('base64'),
          sha: followersResult.data!.sha
        })
      }

      return { success: true }
    } catch (error) {
      console.error('Error adding follower:', error)
      return {
        success: false,
        error: 'Failed to add follower'
      }
    }
  }

  async getFileContent(owner: string, repo: string, path: string) {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path
      })

      if (Array.isArray(data)) {
        return {
          success: false,
          error: 'Path is a directory'
        }
      }

      if (data.type !== 'file') {
        return {
          success: false,
          error: 'Path is not a file'
        }
      }

      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: 'File not found'
      }
    }
  }

  async getUserPosts(username: string) {
    try {
      const postsResult = await this.octokit.rest.repos.getContent({
        owner: username,
        repo: 'open-social-data',
        path: 'posts'
      })

      if (!Array.isArray(postsResult.data)) {
        return { success: true, posts: [] }
      }

      const posts = []
      
      // Get the most recent posts (limit to 20 for performance)
      const postFiles = postsResult.data
        .filter((file: any) => file.name.endsWith('.json'))
        .sort((a: any, b: any) => b.name.localeCompare(a.name))
        .slice(0, 20)

      for (const file of postFiles) {
        if (file.type === 'file' && file.download_url) {
          try {
            const response = await fetch(file.download_url)
            const postData = await response.json()
            posts.push(postData)
          } catch (error) {
            console.error('Error fetching post:', file.name, error)
          }
        }
      }

      return {
        success: true,
        posts: posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }
    } catch (error) {
      console.error('Error getting user posts:', error)
      return {
        success: false,
        error: 'Failed to get posts'
      }
    }
  }

  async getUserProfile(username: string) {
    try {
      const profileResult = await this.getFileContent(username, 'open-social-data', 'profile.json')
      
      if (!profileResult.success) {
        return profileResult
      }

      const profileData = JSON.parse(
        Buffer.from((profileResult.data as any).content!, 'base64').toString()
      )

      return {
        success: true,
        data: profileData
      }
    } catch (error) {
      console.error('Error getting user profile:', error)
      return {
        success: false,
        error: 'Failed to get user profile'
      }
    }
  }
}
