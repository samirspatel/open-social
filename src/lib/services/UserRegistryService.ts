import { Octokit } from '@octokit/rest'

export interface UserRegistration {
  githubId: string
  username: string
  name: string
  email: string
  avatar: string
  handle: string
  repository: string
  joinedAt: string
}

export interface NetworkStats {
  totalUsers: number
  totalConnections: number
  activeUsers: number
  newUsersToday: number
  lastUpdated: string
}

export class UserRegistryService {
  private octokit: Octokit
  private readonly REGISTRY_OWNER = 'samirpatel' // The owner of the open-social repo
  private readonly REGISTRY_REPO = 'open-social' // This repo hosts both the site and user data
  private readonly DATA_BRANCH = 'user-data' // Dedicated branch for user data
  private readonly USERS_DIR = 'users' // Directory for individual user JSON files
  private readonly NETWORK_DIR = 'network' // Directory for network-wide data

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    })
  }

  async registerUser(userInfo: UserRegistration) {
    try {
      // Create individual user file in the users directory
      const userFilePath = `${this.USERS_DIR}/${userInfo.username}.json`
      
      // Prepare user data with metadata
      const userData = {
        ...userInfo,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      }

      // Check if user file already exists
      let existingFileSha: string | undefined
      try {
        const existingFile = await this.octokit.rest.repos.getContent({
          owner: this.REGISTRY_OWNER,
          repo: this.REGISTRY_REPO,
          path: userFilePath,
          ref: this.DATA_BRANCH
        })

        if (!Array.isArray(existingFile.data)) {
          existingFileSha = existingFile.data.sha
        }
      } catch (error) {
        // File doesn't exist - will be created
        console.log(`Creating new user file: ${userFilePath}`)
      }

      // Create or update user file
      const message = existingFileSha 
        ? `Update user: ${userInfo.username}`
        : `Add new user: ${userInfo.username} to GitSocial network`

      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.REGISTRY_OWNER,
        repo: this.REGISTRY_REPO,
        path: userFilePath,
        message,
        content: Buffer.from(JSON.stringify(userData, null, 2)).toString('base64'),
        sha: existingFileSha,
        branch: this.DATA_BRANCH
      })

      // Also update the users index file for quick lookups
      await this.updateUsersIndex(userInfo)

      return { success: true }
    } catch (error) {
      console.error('Error registering user:', error)
      return {
        success: false,
        error: 'Failed to register user'
      }
    }
  }

  private async updateUsersIndex(userInfo: UserRegistration) {
    try {
      const indexPath = `${this.USERS_DIR}/index.json`
      let indexData: { users: Array<{username: string, handle: string, joinedAt: string}>, totalUsers: number, lastUpdated: string } = { 
        users: [], 
        totalUsers: 0,
        lastUpdated: new Date().toISOString() 
      }
      let indexSha: string | undefined

      // Get current index
      try {
        const indexResult = await this.octokit.rest.repos.getContent({
          owner: this.REGISTRY_OWNER,
          repo: this.REGISTRY_REPO,
          path: indexPath,
          ref: this.DATA_BRANCH
        })

        if (!Array.isArray(indexResult.data)) {
          indexData = JSON.parse(
            Buffer.from((indexResult.data as any).content, 'base64').toString()
          )
          indexSha = indexResult.data.sha
        }
      } catch (error) {
        // Index doesn't exist - will be created
        console.log('Creating new users index')
      }

      // Update or add user in index
      const existingIndex = indexData.users.findIndex(u => u.username === userInfo.username)
      const userIndexEntry = {
        username: userInfo.username,
        handle: userInfo.handle,
        joinedAt: userInfo.joinedAt
      }

      if (existingIndex >= 0) {
        indexData.users[existingIndex] = userIndexEntry
      } else {
        indexData.users.push(userIndexEntry)
      }

      // Sort by join date and update counts
      indexData.users.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
      indexData.totalUsers = indexData.users.length
      indexData.lastUpdated = new Date().toISOString()

      // Update index file
      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.REGISTRY_OWNER,
        repo: this.REGISTRY_REPO,
        path: indexPath,
        message: `Update users index for ${userInfo.username}`,
        content: Buffer.from(JSON.stringify(indexData, null, 2)).toString('base64'),
        sha: indexSha,
        branch: this.DATA_BRANCH
      })
      
      // Also update network statistics
      await this.updateNetworkStats('user_signup')
    } catch (error) {
      console.error('Error updating users index:', error)
      // Don't fail registration if index update fails
    }
  }

  private async updateNetworkStats(event: 'user_signup' | 'user_connection') {
    try {
      const statsPath = `${this.NETWORK_DIR}/stats.json`
      let statsData: NetworkStats = {
        totalUsers: 0,
        totalConnections: 0,
        activeUsers: 0,
        newUsersToday: 0,
        lastUpdated: new Date().toISOString()
      }
      let statsSha: string | undefined

      // Get current stats
      try {
        const statsResult = await this.octokit.rest.repos.getContent({
          owner: this.REGISTRY_OWNER,
          repo: this.REGISTRY_REPO,
          path: statsPath,
          ref: this.DATA_BRANCH
        })

        if (!Array.isArray(statsResult.data)) {
          statsData = JSON.parse(
            Buffer.from((statsResult.data as any).content, 'base64').toString()
          )
          statsSha = statsResult.data.sha
        }
      } catch (error) {
        console.log('Creating new stats file')
      }

      // Update stats based on event
      if (event === 'user_signup') {
        statsData.totalUsers += 1
        
        // Check if it's a new user today
        const today = new Date().toISOString().split('T')[0]
        const lastUpdated = statsData.lastUpdated.split('T')[0]
        if (lastUpdated === today) {
          statsData.newUsersToday += 1
        } else {
          statsData.newUsersToday = 1
        }
      } else if (event === 'user_connection') {
        statsData.totalConnections += 1
      }

      statsData.lastUpdated = new Date().toISOString()

      // Update stats file
      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.REGISTRY_OWNER,
        repo: this.REGISTRY_REPO,
        path: statsPath,
        message: `Update network stats: ${event}`,
        content: Buffer.from(JSON.stringify(statsData, null, 2)).toString('base64'),
        sha: statsSha,
        branch: this.DATA_BRANCH
      })
    } catch (error) {
      console.error('Error updating network stats:', error)
      // Don't fail main operation if stats update fails
    }
  }

  async getAllUsers(): Promise<{ success: boolean; users?: UserRegistration[]; error?: string }> {
    try {
      // Get the users index for quick lookup
      const indexPath = `${this.USERS_DIR}/index.json`
      
      try {
        const indexResult = await this.octokit.rest.repos.getContent({
          owner: this.REGISTRY_OWNER,
          repo: this.REGISTRY_REPO,
          path: indexPath,
          ref: this.DATA_BRANCH
        })

        if (!Array.isArray(indexResult.data)) {
          const indexData = JSON.parse(
            Buffer.from((indexResult.data as any).content, 'base64').toString()
          )

          // Get full user details for each user in the index
          const users: UserRegistration[] = []
          
          for (const userIndex of indexData.users.slice(0, 50)) { // Limit to 50 users for performance
            try {
              const userResult = await this.findUserByUsername(userIndex.username)
              if (userResult.success && userResult.user) {
                users.push(userResult.user)
              }
            } catch (error) {
              console.warn(`Failed to get details for user: ${userIndex.username}`)
            }
          }

          return {
            success: true,
            users
          }
        }
      } catch (error) {
        // Index doesn't exist, try to read users directory
        console.log('Users index not found, reading directory...')
      }

      // Fallback: read the users directory directly
      const usersResult = await this.octokit.rest.repos.getContent({
        owner: this.REGISTRY_OWNER,
        repo: this.REGISTRY_REPO,
        path: this.USERS_DIR,
        ref: this.DATA_BRANCH
      })

      if (!Array.isArray(usersResult.data)) {
        return { success: false, error: 'Users directory not found' }
      }

      const users: UserRegistration[] = []
      
      // Limit to first 20 files for performance
      for (const file of usersResult.data.slice(0, 20)) {
        if (file.name.endsWith('.json') && file.name !== 'index.json') {
          try {
            const userFileResult = await this.octokit.rest.repos.getContent({
              owner: this.REGISTRY_OWNER,
              repo: this.REGISTRY_REPO,
              path: file.path,
              ref: this.DATA_BRANCH
            })

            if (!Array.isArray(userFileResult.data)) {
              const userData = JSON.parse(
                Buffer.from((userFileResult.data as any).content, 'base64').toString()
              )
              users.push(userData)
            }
          } catch (error) {
            console.warn(`Failed to read user file: ${file.name}`)
          }
        }
      }

      // Sort by join date
      users.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())

      return {
        success: true,
        users
      }
    } catch (error) {
      console.error('Error getting all users:', error)
      return {
        success: false,
        error: 'Failed to get users'
      }
    }
  }

  async findUserByHandle(handle: string): Promise<{ success: boolean; user?: UserRegistration; error?: string }> {
    try {
      const result = await this.getAllUsers()
      
      if (!result.success || !result.users) {
        return { success: false, error: result.error }
      }

      const user = result.users.find(u => u.handle === handle)
      
      if (!user) {
        return { success: false, error: 'User not found' }
      }

      return {
        success: true,
        user
      }
    } catch (error) {
      console.error('Error finding user by handle:', error)
      return {
        success: false,
        error: 'Failed to find user'
      }
    }
  }

  async findUserByUsername(username: string): Promise<{ success: boolean; user?: UserRegistration; error?: string }> {
    try {
      // Directly access the user's JSON file
      const userFilePath = `${this.USERS_DIR}/${username}.json`
      
      const userResult = await this.octokit.rest.repos.getContent({
        owner: this.REGISTRY_OWNER,
        repo: this.REGISTRY_REPO,
        path: userFilePath,
        ref: this.DATA_BRANCH
      })

      if (Array.isArray(userResult.data)) {
        return { success: false, error: 'User path is a directory' }
      }

      const userData = JSON.parse(
        Buffer.from((userResult.data as any).content, 'base64').toString()
      )

      return {
        success: true,
        user: userData
      }
    } catch (error) {
      console.error('Error finding user by username:', error)
      return {
        success: false,
        error: 'User not found'
      }
    }
  }

  async recordConnection(fromUser: string, toUser: string) {
    try {
      // Update network connections data
      await this.updateNetworkStats('user_connection')
      
      // Could also update a connections mapping file if needed
      // This would track who follows whom for network analysis
      
      return { success: true }
    } catch (error) {
      console.error('Error recording connection:', error)
      return {
        success: false,
        error: 'Failed to record connection'
      }
    }
  }
}