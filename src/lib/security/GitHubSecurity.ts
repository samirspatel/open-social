import { Octokit } from '@octokit/rest'
import crypto from 'crypto'

export interface SecurityConfig {
  allowedOwners: string[]
  requiredScopes: string[]
  webhookSecret?: string
  rateLimitPerHour: number
}

export class GitHubSecurity {
  private octokit: Octokit
  private config: SecurityConfig

  constructor(accessToken: string, config: SecurityConfig) {
    this.octokit = new Octokit({
      auth: accessToken,
    })
    this.config = config
  }

  /**
   * Verify that the current token has the required scopes
   */
  async verifyTokenScopes(): Promise<{ valid: boolean; scopes: string[] }> {
    try {
      // Get the current token's scopes
      const { headers } = await this.octokit.request('GET /user')
      const tokenScopes = headers['x-oauth-scopes']?.split(', ') || []

      const hasRequiredScopes = this.config.requiredScopes.every(scope => 
        tokenScopes.includes(scope)
      )

      return {
        valid: hasRequiredScopes,
        scopes: tokenScopes
      }
    } catch (error) {
      console.error('Error verifying token scopes:', error)
      return { valid: false, scopes: [] }
    }
  }

  /**
   * Set up proper repository permissions and branch protection
   */
  async secureUserRepository(owner: string, repo: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Set repository to public (users control their data)
      await this.octokit.rest.repos.update({
        owner,
        repo,
        private: false,
        has_issues: false,
        has_projects: false,
        has_wiki: false,
        allow_squash_merge: false,
        allow_merge_commit: true,
        allow_rebase_merge: false,
        delete_branch_on_merge: true
      })

      // 2. Protect main branch (users can only write via GitSocial app)
      await this.octokit.rest.repos.updateBranchProtection({
        owner,
        repo,
        branch: 'main',
        required_status_checks: {
          strict: true,
          contexts: []
        },
        enforce_admins: false, // Allow repo owner to override
        required_pull_request_reviews: {
          required_approving_review_count: 0,
          dismiss_stale_reviews: false,
          require_code_owner_reviews: false,
          bypass_pull_request_allowances: {
            users: [owner], // Allow repo owner to bypass
            teams: [],
            apps: ['gitsocial-app'] // Allow GitSocial app
          }
        },
        restrictions: {
          users: [owner], // Only repo owner can push
          teams: [],
          apps: []
        }
      })

      // 3. Add repository topics for discoverability
      await this.octokit.rest.repos.replaceAllTopics({
        owner,
        repo,
        names: ['social-data', 'distributed-social', 'gitsocial', 'open-social']
      })

      return { success: true }
    } catch (error) {
      console.error('Error securing repository:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Verify webhook signature for secure webhook handling
   */
  static verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    if (!secret) {
      console.warn('Webhook secret not configured')
      return false
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    const expectedHeader = `sha256=${expectedSignature}`
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedHeader)
    )
  }

  /**
   * Verify that a user can perform actions on their repository
   */
  async verifyUserRepositoryAccess(username: string, repo: string): Promise<boolean> {
    try {
      const { data: repoData } = await this.octokit.rest.repos.get({
        owner: username,
        repo
      })

      // Verify the repository is owned by the user
      return repoData.owner.login === username
    } catch (error) {
      return false
    }
  }

  /**
   * Check if current user is authorized to modify the main GitSocial repository
   */
  async verifyMainRepoCollaboratorAccess(username: string): Promise<boolean> {
    try {
      if (!this.config.allowedOwners.includes(username)) {
        return false
      }

      // Check if user is a collaborator on the main repo
      await this.octokit.rest.repos.checkCollaborator({
        owner: 'samirpatel',
        repo: 'open-social',
        username
      })

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Rate limiting check (implement in-memory or Redis cache)
   */
  static rateLimitKey(action: string, identifier: string): string {
    return `ratelimit:${action}:${identifier}`
  }

  /**
   * Sanitize user input for repository operations
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/[^a-zA-Z0-9\-_.]/g, '') // Only allow alphanumeric, hyphens, underscores, dots
      .slice(0, 100) // Limit length
  }

  /**
   * Generate secure webhook secret
   */
  static generateWebhookSecret(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Validate repository name follows GitHub standards
   */
  static isValidRepositoryName(name: string): boolean {
    // GitHub repository name rules
    const validPattern = /^[a-zA-Z0-9._-]+$/
    const isNotEmpty = name.length > 0
    const isNotTooLong = name.length <= 100
    const doesNotStartWithSpecialChar = !/^[._-]/.test(name)
    const doesNotEndWithSpecialChar = !/[._-]$/.test(name)

    return validPattern.test(name) && 
           isNotEmpty && 
           isNotTooLong && 
           doesNotStartWithSpecialChar && 
           doesNotEndWithSpecialChar
  }
}
