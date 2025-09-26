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

export class UserRegistryService {
  private octokit: Octokit
  private readonly REGISTRY_OWNER = process.env.REGISTRY_OWNER || 'open-social-app' // Use env var or default
  private readonly REGISTRY_REPO = process.env.REGISTRY_REPO || 'registry'
  private readonly REGISTRY_PATH = 'users/registry.json'

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    })
  }

  async registerUser(userInfo: UserRegistration) {
    try {
      // Get current registry
      let registryData: { users: UserRegistration[] } = { users: [] }
      let registrySha: string | undefined

      try {
        const registryResult = await this.octokit.rest.repos.getContent({
          owner: this.REGISTRY_OWNER,
          repo: this.REGISTRY_REPO,
          path: this.REGISTRY_PATH
        })

        if (!Array.isArray(registryResult.data)) {
          registryData = JSON.parse(
            Buffer.from((registryResult.data as any).content, 'base64').toString()
          )
          registrySha = registryResult.data.sha
        }
      } catch (error) {
        // Registry doesn't exist yet - will be created
        console.log('Registry file does not exist, creating new one')
      }

      // Check if user already exists
      const existingUserIndex = registryData.users.findIndex(
        user => user.githubId === userInfo.githubId
      )

      if (existingUserIndex >= 0) {
        // Update existing user
        registryData.users[existingUserIndex] = {
          ...registryData.users[existingUserIndex],
          ...userInfo
        }
      } else {
        // Add new user
        registryData.users.push(userInfo)
      }

      // Sort users by joinedAt date
      registryData.users.sort((a, b) => 
        new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
      )

      // Update registry file
      const message = existingUserIndex >= 0 
        ? `Update user registration: ${userInfo.username}`
        : `Add new user: ${userInfo.username}`

      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.REGISTRY_OWNER,
        repo: this.REGISTRY_REPO,
        path: this.REGISTRY_PATH,
        message,
        content: Buffer.from(JSON.stringify(registryData, null, 2)).toString('base64'),
        sha: registrySha
      })

      return { success: true }
    } catch (error) {
      console.error('Error registering user:', error)
      return {
        success: false,
        error: 'Failed to register user'
      }
    }
  }

  async getAllUsers(): Promise<{ success: boolean; users?: UserRegistration[]; error?: string }> {
    try {
      const registryResult = await this.octokit.rest.repos.getContent({
        owner: this.REGISTRY_OWNER,
        repo: this.REGISTRY_REPO,
        path: this.REGISTRY_PATH
      })

      if (Array.isArray(registryResult.data)) {
        return { success: false, error: 'Registry path is a directory' }
      }

      const registryData = JSON.parse(
        Buffer.from((registryResult.data as any).content, 'base64').toString()
      )

      return {
        success: true,
        users: registryData.users || []
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
      const result = await this.getAllUsers()
      
      if (!result.success || !result.users) {
        return { success: false, error: result.error }
      }

      const user = result.users.find(u => u.username === username)
      
      if (!user) {
        return { success: false, error: 'User not found' }
      }

      return {
        success: true,
        user
      }
    } catch (error) {
      console.error('Error finding user by username:', error)
      return {
        success: false,
        error: 'Failed to find user'
      }
    }
  }
}
