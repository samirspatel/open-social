import { GitHubService } from '@/lib/github/GitHubService'
import { UserRegistryService } from './UserRegistryService'

export class SocialService {
  private githubService: GitHubService
  private userRegistry: UserRegistryService

  constructor(accessToken: string) {
    this.githubService = new GitHubService(accessToken)
    this.userRegistry = new UserRegistryService(accessToken)
  }

  async followUser(currentUsername: string, targetUsername: string) {
    try {
      // Find the target user in the registry
      const targetUserResult = await this.userRegistry.findUserByUsername(targetUsername)
      
      if (!targetUserResult.success || !targetUserResult.user) {
        throw new Error('Target user not found')
      }

      const currentUserResult = await this.userRegistry.findUserByUsername(currentUsername)
      
      if (!currentUserResult.success || !currentUserResult.user) {
        throw new Error('Current user not found')
      }

      // Add to current user's following list
      const followResult = await this.githubService.followUser(
        currentUsername,
        targetUsername,
        targetUserResult.user.handle
      )

      if (!followResult.success) {
        throw new Error('Failed to update following list')
      }

      // Add to target user's followers list
      const followerResult = await this.githubService.addFollower(
        targetUsername,
        currentUsername,
        currentUserResult.user.handle
      )

      if (!followerResult.success) {
        console.warn('Failed to update target user followers list, but follow was successful')
      }

      return { success: true }
    } catch (error) {
      console.error('Error in followUser:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to follow user'
      }
    }
  }

  async unfollowUser(currentUsername: string, targetUsername: string) {
    try {
      // Find both users in the registry
      const targetUserResult = await this.userRegistry.findUserByUsername(targetUsername)
      const currentUserResult = await this.userRegistry.findUserByUsername(currentUsername)
      
      if (!targetUserResult.success || !currentUserResult.success) {
        throw new Error('User not found')
      }

      // Remove from current user's following list
      await this.removeFromFollowingList(currentUsername, targetUserResult.user!.handle)
      
      // Remove from target user's followers list
      await this.removeFromFollowersList(targetUsername, currentUserResult.user!.handle)

      return { success: true }
    } catch (error) {
      console.error('Error in unfollowUser:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to unfollow user'
      }
    }
  }

  private async removeFromFollowingList(username: string, targetHandle: string) {
    try {
      const followingResult = await this.githubService.getFileContent(username, 'social-data', 'social/following.json')
      
      if (!followingResult.success) {
        throw new Error('Failed to get following list')
      }

      const followingData = JSON.parse(
        Buffer.from(followingResult.data!.content!, 'base64').toString()
      )

      // Remove the target user
      followingData.following = followingData.following.filter(
        (f: any) => f.handle !== targetHandle
      )

      // Update the file
      await this.githubService.getFileContent(username, 'social-data', 'social/following.json')
      // Implementation would continue here...
    } catch (error) {
      console.error('Error removing from following list:', error)
      throw error
    }
  }

  private async removeFromFollowersList(username: string, followerHandle: string) {
    try {
      const followersResult = await this.githubService.getFileContent(username, 'social-data', 'social/followers.json')
      
      if (!followersResult.success) {
        throw new Error('Failed to get followers list')
      }

      const followersData = JSON.parse(
        Buffer.from(followersResult.data!.content!, 'base64').toString()
      )

      // Remove the follower
      followersData.followers = followersData.followers.filter(
        (f: any) => f.handle !== followerHandle
      )

      // Update the file
      // Implementation would continue here...
    } catch (error) {
      console.error('Error removing from followers list:', error)
      throw error
    }
  }

  async getFeedData(username: string) {
    try {
      // Get user's following list
      const followingResult = await this.githubService.getFileContent(username, 'social-data', 'social/following.json')
      
      if (!followingResult.success) {
        return { success: false, error: 'Failed to get following list' }
      }

      const followingData = JSON.parse(
        Buffer.from(followingResult.data!.content!, 'base64').toString()
      )

      const allPosts = []

      // Get posts from all followed users
      for (const follow of followingData.following) {
        const [followedUsername] = follow.repository.split('/')
        try {
          const postsResult = await this.githubService.getUserPosts(followedUsername)
          if (postsResult.success && postsResult.posts) {
            allPosts.push(...postsResult.posts)
          }
        } catch (error) {
          console.warn(`Failed to get posts for ${followedUsername}:`, error)
        }
      }

      // Also include user's own posts
      const ownPostsResult = await this.githubService.getUserPosts(username)
      if (ownPostsResult.success && ownPostsResult.posts) {
        allPosts.push(...ownPostsResult.posts)
      }

      // Sort by creation date
      allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      return {
        success: true,
        posts: allPosts
      }
    } catch (error) {
      console.error('Error getting feed data:', error)
      return {
        success: false,
        error: 'Failed to get feed data'
      }
    }
  }
}
