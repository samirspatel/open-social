import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import type { NextAuthOptions } from 'next-auth'
import { GitHubService } from '@/lib/github/GitHubService'
import { UserRegistryService } from '@/lib/services/UserRegistryService'
import { GitHubSecurity } from '@/lib/security/GitHubSecurity'

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          // Request minimal required scopes for security
          scope: [
            'read:user', // Read user profile
            'user:email', // Read user email  
            'public_repo', // Create and manage public repositories
            'repo:status', // Read repository status
            'read:org', // Read organization membership (for verification)
          ].join(' ')
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'github' && account.access_token) {
        try {
          // Initialize security service
          const securityConfig = {
            allowedOwners: ['samirpatel'], // Main repo collaborators
            requiredScopes: ['read:user', 'user:email', 'public_repo', 'repo:status'],
            rateLimitPerHour: 100
          }
          
          const githubSecurity = new GitHubSecurity(account.access_token, securityConfig)
          const githubService = new GitHubService(account.access_token)
          const userRegistry = new UserRegistryService(account.access_token)
          
          // Verify token has required scopes
          const scopeCheck = await githubSecurity.verifyTokenScopes()
          if (!scopeCheck.valid) {
            console.error('Insufficient OAuth scopes:', scopeCheck.scopes)
            return false
          }
          
          // Check if user already has a social-data repository
          const socialRepo = await githubService.getRepository(user.name!, 'social-data')
          
          if (!socialRepo.success) {
            // First-time user - create their social-data repository
            console.log('Creating social-data repository for new user:', user.name)
            
            const createResult = await githubService.createSocialDataRepository(user.name!)
            if (!createResult.success) {
              console.error('Failed to create social-data repository:', createResult.error)
              return false
            }
            
            // Initialize the repository with default structure
            await githubService.initializeSocialDataRepository(user.name!, {
              name: user.name || '',
              email: user.email || '',
              avatar: user.image || '',
              githubId: (profile as any)?.id?.toString() || '',
              handle: `@${user.name}.github.io`
            })
            
            // Secure the user's repository with proper permissions
            await githubSecurity.secureUserRepository(user.name!, 'social-data')
          }
          
          // Register or update user in the main repository
          await userRegistry.registerUser({
            githubId: (profile as any)?.id?.toString() || '',
            username: user.name!,
            name: user.name || '',
            email: user.email || '',
            avatar: user.image || '',
            handle: `@${user.name}.github.io`,
            repository: `${user.name}/social-data`,
            joinedAt: new Date().toISOString()
          })
          
          return true
        } catch (error) {
          console.error('Error during sign in:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.githubId = (profile as any)?.id?.toString()
      }
      return token
    },
    async session({ session, token }) {
      // Add the access token and GitHub ID to the session
      session.accessToken = token.accessToken as string
      session.user.githubId = token.githubId as string
      return session
    }
  },
  pages: {
    signIn: '/',  // Custom sign in page
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
