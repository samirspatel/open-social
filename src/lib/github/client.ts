import { Octokit } from '@octokit/rest'
import type { GitHubRepository, GitHubFile } from '@/types'

export class GitHubClient {
  private octokit: Octokit

  constructor(accessToken?: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    })
  }

  async getUser(username?: string) {
    try {
      const { data } = username 
        ? await this.octokit.rest.users.getByUsername({ username })
        : await this.octokit.rest.users.getAuthenticated()
      
      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch user data'
      }
    }
  }

  async createRepository(name: string, description?: string, isPrivate = false) {
    try {
      const { data } = await this.octokit.rest.repos.createForAuthenticatedUser({
        name,
        description: description || `Social data repository for ${name}`,
        private: isPrivate,
        has_issues: false,
        has_projects: false,
        has_wiki: false,
        auto_init: true,
        gitignore_template: 'Node'
      })

      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create repository'
      }
    }
  }

  async getRepository(owner: string, repo: string): Promise<{ success: boolean; data?: GitHubRepository; error?: string }> {
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

  async getFileContent(owner: string, repo: string, path: string): Promise<{ success: boolean; data?: GitHubFile; error?: string }> {
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

  async createOrUpdateFile(
    owner: string, 
    repo: string, 
    path: string, 
    content: string, 
    message: string,
    sha?: string
  ) {
    try {
      const { data } = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString('base64'),
        sha
      })

      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create or update file'
      }
    }
  }

  async deleteFile(owner: string, repo: string, path: string, message: string, sha: string) {
    try {
      const { data } = await this.octokit.rest.repos.deleteFile({
        owner,
        repo,
        path,
        message,
        sha
      })

      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete file'
      }
    }
  }

  async listRepositoryContents(owner: string, repo: string, path: string = '') {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path
      })

      return {
        success: true,
        data: Array.isArray(data) ? data : [data]
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to list repository contents'
      }
    }
  }

  async createWebhook(owner: string, repo: string, webhookUrl: string) {
    try {
      const { data } = await this.octokit.rest.repos.createWebhook({
        owner,
        repo,
        config: {
          url: webhookUrl,
          content_type: 'json',
          secret: process.env.GITHUB_WEBHOOK_SECRET
        },
        events: ['push', 'create', 'delete']
      })

      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create webhook'
      }
    }
  }
}
