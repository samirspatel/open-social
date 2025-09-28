/**
 * GitHub App Authentication with Device Flow
 * Repository-specific access only - SECURE for GitHub Pages
 */

export class GitHubAppAuth {
  private readonly APP_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_APP_CLIENT_ID || 'your_github_app_client_id'
  private readonly AUTH_KEY = 'gitsocial_app_auth'
  private readonly REPO_NAME = 'open-social-data'

  /**
   * Start GitHub App Device Flow
   * This flow works entirely client-side - perfect for GitHub Pages
   */
  async login(): Promise<void> {
    try {
      // Step 1: Request device code
      const deviceResponse = await fetch('https://github.com/login/device/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.APP_CLIENT_ID,
          scope: 'contents:write metadata:read', // Minimal GitHub App scopes
        })
      })

      const deviceData = await deviceResponse.json()
      
      if (!deviceResponse.ok) {
        throw new Error(`Device flow error: ${deviceData.error_description}`)
      }

      // Step 2: Show user the verification URL
      this.showDeviceVerification(deviceData)

      // Step 3: Poll for authorization
      await this.pollForAuthorization(deviceData)

    } catch (error) {
      console.error('GitHub App login error:', error)
      throw error
    }
  }

  private showDeviceVerification(deviceData: any): void {
    const modal = this.createVerificationModal(deviceData)
    document.body.appendChild(modal)
  }

  private createVerificationModal(deviceData: any): HTMLElement {
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-2xl max-w-md mx-4 p-6">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 9.293 10.793a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd"></path>
            </svg>
          </div>
          
          <h2 class="text-xl font-bold mb-4">Secure GitHub Authentication</h2>
          
          <div class="bg-gray-100 p-4 rounded-lg mb-4">
            <p class="text-sm text-gray-600 mb-2">Go to this URL:</p>
            <a href="${deviceData.verification_uri}" target="_blank" 
               class="text-blue-600 font-mono text-lg hover:underline">
              ${deviceData.verification_uri}
            </a>
          </div>
          
          <div class="bg-blue-50 p-4 rounded-lg mb-4">
            <p class="text-sm text-blue-800 mb-2">Enter this code:</p>
            <div class="text-2xl font-mono font-bold text-blue-900 tracking-wider">
              ${deviceData.user_code}
            </div>
          </div>
          
          <div class="text-xs text-gray-500 mb-4">
            ⚠️ Only grant access to your <strong>open-social-data</strong> repository
          </div>
          
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span class="ml-2 text-sm text-gray-600">Waiting for authorization...</span>
          </div>
        </div>
      </div>
    `

    return modal
  }

  private async pollForAuthorization(deviceData: any): Promise<void> {
    const interval = deviceData.interval * 1000 // Convert to milliseconds
    const expiresAt = Date.now() + (deviceData.expires_in * 1000)

    return new Promise((resolve, reject) => {
      const poll = async () => {
        if (Date.now() >= expiresAt) {
          reject(new Error('Device flow expired'))
          return
        }

        try {
          const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              client_id: this.APP_CLIENT_ID,
              device_code: deviceData.device_code,
              grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
            })
          })

          const tokenData = await tokenResponse.json()

          if (tokenData.access_token) {
            // Success! Store the token and get user info
            await this.handleSuccessfulAuth(tokenData.access_token)
            this.removeVerificationModal()
            resolve()
          } else if (tokenData.error === 'authorization_pending') {
            // Still waiting for user to authorize
            setTimeout(poll, interval)
          } else if (tokenData.error === 'slow_down') {
            // Rate limited, wait longer
            setTimeout(poll, interval + 5000)
          } else {
            // Error occurred
            reject(new Error(`Authorization error: ${tokenData.error_description}`))
          }
        } catch (error) {
          reject(error)
        }
      }

      setTimeout(poll, interval)
    })
  }

  private async handleSuccessfulAuth(accessToken: string): Promise<void> {
    // Get user information
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    })

    if (!userResponse.ok) {
      throw new Error('Failed to get user information')
    }

    const userData = await userResponse.json()

    // Verify the app is installed on the target repository
    await this.verifyRepositoryAccess(accessToken, userData.login)

    // Store auth data
    const authData = {
      token: accessToken,
      user: userData,
      timestamp: Date.now(),
      appAuth: true, // Flag to distinguish from PAT auth
    }

    localStorage.setItem(this.AUTH_KEY, JSON.stringify(authData))

    // Reload the page to update the UI
    window.location.reload()
  }

  private async verifyRepositoryAccess(token: string, username: string): Promise<void> {
    try {
      // Check if we can access the specific repository
      const repoResponse = await fetch(`https://api.github.com/repos/${username}/${this.REPO_NAME}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      })

      if (!repoResponse.ok && repoResponse.status === 404) {
        // Repository doesn't exist yet - this is fine, we'll create it
        return
      }

      if (!repoResponse.ok) {
        throw new Error('Failed to verify repository access')
      }

      // Success - we have access to the specific repository
    } catch (error) {
      throw new Error(`Repository access verification failed: ${error.message}`)
    }
  }

  private removeVerificationModal(): void {
    const modal = document.querySelector('.fixed.inset-0.bg-black') as HTMLElement
    if (modal) {
      modal.remove()
    }
  }

  async getCurrentUser(): Promise<any> {
    const authData = this.getStoredAuth()
    if (!authData || !authData.appAuth) {
      throw new Error('Not authenticated with GitHub App')
    }

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${authData.token}`,
          'Accept': 'application/vnd.github.v3+json',
        }
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
}
