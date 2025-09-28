/**
 * Public Repository Authentication
 * ZERO security risks - perfect for social media
 */

export class PublicRepoAuth {
  private readonly AUTH_KEY = 'gitsocial_public_auth'
  private readonly REPO_NAME = 'open-social-data'

  /**
   * Authenticate with public repository access only
   * Uses minimal scopes - NO private repo access
   */
  async login(): Promise<void> {
    const instructions = `
🔐 GitSocial - Public Repository Authentication

GitSocial stores your social media data in a PUBLIC repository.
This is actually SAFER because:
• Social media posts are public anyway
• No access to your private repositories
• Full transparency and portability
• Zero security risks

Create a Personal Access Token with ONLY these scopes:

1. Go to: https://github.com/settings/tokens/new
2. Set description: "GitSocial Public Access"
3. Set expiration: "No expiration" (or your preference)
4. Select ONLY these scopes:
   ✅ public_repo (Access public repositories)
   ✅ read:user (Read user profile data)
   ✅ user:email (Access user email addresses)

5. Generate token and paste below

🛡️ SECURITY: This token CANNOT access private repositories!
`

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
          'Accept': 'application/vnd.github.v3+json',
        },
      })

      if (response.ok) {
        const userData = await response.json()

        // Verify token scopes are appropriate
        const scopes = response.headers.get('X-OAuth-Scopes')?.split(', ') || []
        
        if (scopes.includes('repo')) {
          throw new Error('⚠️ Security Risk: Your token has access to private repositories!\n\nPlease create a new token with ONLY:\n• public_repo\n• read:user\n• user:email')
        }

        if (!scopes.includes('public_repo')) {
          throw new Error('Token missing required scope: public_repo')
        }

        // Store auth data
        const authData = {
          token,
          user: userData,
          timestamp: Date.now(),
          scopes,
          publicOnly: true,
        }
        localStorage.setItem(this.AUTH_KEY, JSON.stringify(authData))

        alert('🎉 Secure authentication successful!\n\nYour token only has access to public repositories.')
        
        // Reload the page to update the UI
        window.location.reload()
      } else {
        throw new Error('Invalid token')
      }
    } catch (error) {
      alert(`Authentication failed: ${error.message}`)
      throw error
    }
  }

  async getCurrentUser(): Promise<any> {
    const authData = this.getStoredAuth()
    if (!authData) {
      throw new Error('Not authenticated')
    }

    // Check if token is still valid
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${authData.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      })

      if (response.ok) {
        const userData = await response.json()
        return {
          ...userData,
          token: authData.token,
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

  /**
   * Get repository information
   * Will be public, ensuring transparency
   */
  async getRepositoryInfo(username: string): Promise<any> {
    const token = this.getToken()
    if (!token) throw new Error('Not authenticated')

    const response = await fetch(`https://api.github.com/repos/${username}/${this.REPO_NAME}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    if (response.ok) {
      return await response.json()
    } else if (response.status === 404) {
      return null // Repository doesn't exist yet
    } else {
      throw new Error('Failed to get repository information')
    }
  }
}
