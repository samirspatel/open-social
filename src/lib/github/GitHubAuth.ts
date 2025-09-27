export class GitHubAuth {
  // Store auth data in localStorage
  private readonly AUTH_KEY = 'gitsocial_auth'

  constructor() {
    // No OAuth callback handling needed for token-based auth
  }

  async login(): Promise<void> {
    // Direct token input approach for GitHub Pages
    const instructions = `
To use GitSocial, you need a GitHub Personal Access Token:

1. Go to: https://github.com/settings/tokens/new
2. Set description: "GitSocial Access" 
3. Set expiration: "No expiration" (or your preferred duration)
4. Select these scopes:
   ✓ repo (Full control of private repositories)
   ✓ read:user (Read user profile data)
   ✓ user:email (Access user email addresses)

5. Click "Generate token"
6. Copy the token and paste it below

Your token is stored locally and never sent to any server.
GitSocial communicates directly with GitHub's API.`

    const token = prompt(instructions)

    if (token) {
      await this.validateAndStoreToken(token.trim())
    } else {
      throw new Error('Token required for authentication')
    }
  }

  private async validateAndStoreToken(token: string): Promise<void> {
    try {
      // Validate token by making a test API call
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      if (response.ok) {
        const userData = await response.json()
        
        // Store auth data
        const authData = {
          token,
          user: userData,
          timestamp: Date.now()
        }
        localStorage.setItem(this.AUTH_KEY, JSON.stringify(authData))
        
        // Reload the page to update the UI
        window.location.reload()
      } else {
        throw new Error('Invalid token')
      }
    } catch (error) {
      alert('Invalid token. Please try again.')
      throw error
    }
  }

  async getCurrentUser(): Promise<any> {
    const authData = this.getStoredAuth()
    if (!authData) {
      throw new Error('Not authenticated')
    }

    // Check if token is still valid (refresh user data)
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${authData.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      if (response.ok) {
        const userData = await response.json()
        return {
          ...userData,
          token: authData.token
        }
      } else {
        // Token expired or invalid
        this.logout()
        throw new Error('Authentication expired')
      }
    } catch (error) {
      this.logout()
      throw error
    }
  }

  getToken(): string | null {
    const authData = this.getStoredAuth()
    return authData?.token || null
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY)
    localStorage.removeItem('oauth_state')
    window.location.reload()
  }

  private getStoredAuth(): any {
    try {
      const stored = localStorage.getItem(this.AUTH_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }
}
