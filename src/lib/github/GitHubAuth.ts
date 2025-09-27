export class GitHubAuth {
  private readonly CLIENT_ID = '4d7c4f6e8a1b2c3d4e5f' // Replace with your GitHub OAuth App client ID
  private readonly REDIRECT_URI = window.location.origin + '/auth/callback'
  private readonly SCOPES = ['read:user', 'user:email', 'public_repo', 'repo']

  // Store auth data in localStorage
  private readonly AUTH_KEY = 'gitsocial_auth'

  constructor() {
    // Handle OAuth callback if we're on the callback page
    this.handleCallback()
  }

  async login(): Promise<void> {
    // Generate state for security
    const state = this.generateState()
    localStorage.setItem('oauth_state', state)

    // Redirect to GitHub OAuth
    const params = new URLSearchParams({
      client_id: this.CLIENT_ID,
      redirect_uri: this.REDIRECT_URI,
      scope: this.SCOPES.join(' '),
      state,
      allow_signup: 'true'
    })

    window.location.href = `https://github.com/login/oauth/authorize?${params}`
  }

  private handleCallback(): void {
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const storedState = localStorage.getItem('oauth_state')

    if (code && state === storedState) {
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)
      
      // Exchange code for token using GitHub's device flow approach
      this.exchangeCodeForToken(code)
    }
  }

  private async exchangeCodeForToken(code: string): Promise<void> {
    try {
      // For GitHub Pages, we'll use a CORS proxy or GitHub's client-side flow
      // This is a simplified version - in production, you might use GitHub's device flow
      // or a serverless function for the token exchange
      
      // For now, we'll prompt the user to create a personal access token
      // as GitHub's OAuth requires a server-side exchange normally
      
      const token = prompt(`
        For GitSocial to work, please create a GitHub Personal Access Token:
        
        1. Go to: https://github.com/settings/tokens/new
        2. Set description: "GitSocial Access"
        3. Select scopes: repo, read:user, user:email
        4. Generate token and paste it here:
      `)

      if (token) {
        await this.validateAndStoreToken(token)
      }
    } catch (error) {
      console.error('Token exchange failed:', error)
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
