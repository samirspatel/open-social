export class GitHubAPI {
  private baseURL = 'https://api.github.com'
  private token: string

  constructor(token: string) {
    this.token = token
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // User operations
  async getCurrentUser(): Promise<any> {
    return this.request('/user')
  }

  async getUser(username: string): Promise<any> {
    return this.request(`/users/${username}`)
  }

  // Repository operations
  async createRepository(name: string, description?: string, isPrivate = false): Promise<any> {
    return this.request('/user/repos', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description: description || `${name} - GitSocial data repository`,
        private: isPrivate,
        auto_init: true,
        has_issues: false,
        has_projects: false,
        has_wiki: false
      })
    })
  }

  async getRepository(owner: string, repo: string): Promise<any> {
    return this.request(`/repos/${owner}/${repo}`)
  }

  async repositoryExists(owner: string, repo: string): Promise<boolean> {
    try {
      await this.getRepository(owner, repo)
      return true
    } catch {
      return false
    }
  }

  // File operations
  async getFileContent(owner: string, repo: string, path: string): Promise<any> {
    return this.request(`/repos/${owner}/${repo}/contents/${path}`)
  }

  async createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    sha?: string
  ): Promise<any> {
    return this.request(`/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: btoa(unescape(encodeURIComponent(content))), // Base64 encode
        sha
      })
    })
  }

  // Social data operations
  async initializeSocialDataRepo(username: string, userData: any): Promise<void> {
    const repoName = 'open-social-data'
    
    // Create the repository
    await this.createRepository(repoName, 'GitSocial distributed social data')

    // Wait a moment for repo to be ready
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Initialize profile
    const profile = {
      name: userData.name || userData.login,
      username: userData.login,
      bio: userData.bio || '',
      avatar: userData.avatar_url,
      location: userData.location || '',
      website: userData.blog || '',
      githubId: userData.id,
      joinedAt: new Date().toISOString(),
      handle: `@${userData.login}.github.io`
    }

    await this.createOrUpdateFile(
      username,
      repoName,
      'profile.json',
      JSON.stringify(profile, null, 2),
      'Initialize GitSocial profile'
    )

    // Initialize posts directory structure
    const currentYear = new Date().getFullYear()
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0')
    
    await this.createOrUpdateFile(
      username,
      repoName,
      `posts/${currentYear}/${currentMonth}/.gitkeep`,
      '',
      'Initialize posts directory structure'
    )

    // Initialize social connections
    await this.createOrUpdateFile(
      username,
      repoName,
      'social/following.json',
      JSON.stringify({ following: [] }, null, 2),
      'Initialize following list'
    )

    await this.createOrUpdateFile(
      username,
      repoName,
      'social/followers.json',
      JSON.stringify({ followers: [] }, null, 2),
      'Initialize followers list'
    )

    // Initialize configuration
    const config = {
      version: '1.0',
      createdAt: new Date().toISOString(),
      app: 'GitSocial',
      schema: 'distributed-social-v1'
    }

    await this.createOrUpdateFile(
      username,
      repoName,
      '.gitsocial/config.json',
      JSON.stringify(config, null, 2),
      'Initialize GitSocial configuration'
    )
  }

  async createPost(username: string, content: string, images: string[] = []): Promise<any> {
    const repoName = 'open-social-data'
    const postId = Date.now().toString()
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    
    const post = {
      id: postId,
      content,
      images,
      createdAt: currentDate.toISOString(),
      author: username,
      mentions: this.extractMentions(content),
      hashtags: this.extractHashtags(content),
      likes: [],
      comments: []
    }

    const path = `posts/${year}/${month}/${postId}.json`
    
    await this.createOrUpdateFile(
      username,
      repoName,
      path,
      JSON.stringify(post, null, 2),
      `Add new post: ${content.substring(0, 50)}...`
    )

    return post
  }

  async getUserPosts(username: string, limit = 10): Promise<any[]> {
    const repoName = 'open-social-data'
    
    try {
      // Get posts directory structure
      const postsDir = await this.request(`/repos/${username}/${repoName}/contents/posts`)
      const posts = []
      
      // Sort years in descending order
      const years = postsDir
        .filter((item: any) => item.type === 'dir')
        .sort((a: any, b: any) => b.name.localeCompare(a.name))

      for (const year of years.slice(0, 2)) { // Last 2 years
        try {
          const yearDir = await this.request(`/repos/${username}/${repoName}/contents/posts/${year.name}`)
          const months = yearDir
            .filter((item: any) => item.type === 'dir')
            .sort((a: any, b: any) => b.name.localeCompare(a.name))

          for (const month of months.slice(0, 6)) { // Last 6 months
            try {
              const monthDir = await this.request(`/repos/${username}/${repoName}/contents/posts/${year.name}/${month.name}`)
              const postFiles = monthDir
                .filter((item: any) => item.name.endsWith('.json'))
                .sort((a: any, b: any) => b.name.localeCompare(a.name))

              for (const postFile of postFiles.slice(0, limit - posts.length)) {
                try {
                  const fileContent = await this.getFileContent(username, repoName, postFile.path)
                  const postData = JSON.parse(atob(fileContent.content))
                  posts.push(postData)
                } catch (error) {
                  console.error(`Error reading post ${postFile.path}:`, error)
                }
              }

              if (posts.length >= limit) break
            } catch (error) {
              console.error(`Error reading month ${month.name}:`, error)
            }
          }

          if (posts.length >= limit) break
        } catch (error) {
          console.error(`Error reading year ${year.name}:`, error)
        }
      }

      return posts
    } catch (error) {
      console.error('Error getting user posts:', error)
      return []
    }
  }

  async followUser(currentUsername: string, targetUsername: string): Promise<void> {
    const repoName = 'open-social-data'
    
    // Add to current user's following list
    try {
      const followingFile = await this.getFileContent(currentUsername, repoName, 'social/following.json')
      const followingData = JSON.parse(atob(followingFile.content))
      
      if (!followingData.following.includes(targetUsername)) {
        followingData.following.push(targetUsername)
        followingData.lastUpdated = new Date().toISOString()
        
        await this.createOrUpdateFile(
          currentUsername,
          repoName,
          'social/following.json',
          JSON.stringify(followingData, null, 2),
          `Follow ${targetUsername}`,
          followingFile.sha
        )
      }
    } catch (error) {
      console.error('Error updating following list:', error)
    }

    // Add to target user's followers list
    try {
      const followersFile = await this.getFileContent(targetUsername, repoName, 'social/followers.json')
      const followersData = JSON.parse(atob(followersFile.content))
      
      if (!followersData.followers.includes(currentUsername)) {
        followersData.followers.push(currentUsername)
        followersData.lastUpdated = new Date().toISOString()
        
        await this.createOrUpdateFile(
          targetUsername,
          repoName,
          'social/followers.json',
          JSON.stringify(followersData, null, 2),
          `New follower: ${currentUsername}`,
          followersFile.sha
        )
      }
    } catch (error) {
      console.error('Error updating followers list:', error)
    }
  }

  async unfollowUser(currentUsername: string, targetUsername: string): Promise<void> {
    const repoName = 'open-social-data'
    
    // Remove from current user's following list
    try {
      const followingFile = await this.getFileContent(currentUsername, repoName, 'social/following.json')
      const followingData = JSON.parse(atob(followingFile.content))
      
      followingData.following = followingData.following.filter((user: string) => user !== targetUsername)
      followingData.lastUpdated = new Date().toISOString()
      
      await this.createOrUpdateFile(
        currentUsername,
        repoName,
        'social/following.json',
        JSON.stringify(followingData, null, 2),
        `Unfollow ${targetUsername}`,
        followingFile.sha
      )
    } catch (error) {
      console.error('Error updating following list:', error)
    }

    // Remove from target user's followers list
    try {
      const followersFile = await this.getFileContent(targetUsername, repoName, 'social/followers.json')
      const followersData = JSON.parse(atob(followersFile.content))
      
      followersData.followers = followersData.followers.filter((user: string) => user !== currentUsername)
      followersData.lastUpdated = new Date().toISOString()
      
      await this.createOrUpdateFile(
        targetUsername,
        repoName,
        'social/followers.json',
        JSON.stringify(followersData, null, 2),
        `Remove follower: ${currentUsername}`,
        followersFile.sha
      )
    } catch (error) {
      console.error('Error updating followers list:', error)
    }
  }

  private extractMentions(content: string): string[] {
    const mentionRegex = /@(\w+)/g
    const mentions = []
    let match
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1])
    }
    return mentions
  }

  private extractHashtags(content: string): string[] {
    const hashtagRegex = /#(\w+)/g
    const hashtags = []
    let match
    while ((match = hashtagRegex.exec(content)) !== null) {
      hashtags.push(match[1])
    }
    return hashtags
  }
}
