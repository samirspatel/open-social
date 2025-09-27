import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { GitHubSecurity } from '@/lib/security/GitHubSecurity'

/**
 * Admin API for managing GitSocial application
 * Only authorized collaborators can access these endpoints
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken || !session?.user?.name) {
      return NextResponse.json(
        { error: 'Unauthorized - Login required' },
        { status: 401 }
      )
    }

    const securityConfig = {
      allowedOwners: ['samirpatel'], // Add other authorized maintainers here
      requiredScopes: ['read:user', 'user:email', 'public_repo'],
      rateLimitPerHour: 100
    }

    const githubSecurity = new GitHubSecurity(session.accessToken, securityConfig)
    
    // Verify user is authorized to access admin functions
    const isAuthorized = await githubSecurity.verifyMainRepoCollaboratorAccess(session.user.name)
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'stats':
        // Return application statistics
        return NextResponse.json({
          message: 'GitSocial Admin Dashboard',
          permissions: 'Full access granted',
          user: session.user.name,
          timestamp: new Date().toISOString()
        })

      case 'users':
        // Return user management interface
        return NextResponse.json({
          message: 'User management access granted',
          user: session.user.name
        })

      default:
        return NextResponse.json({
          error: 'Invalid action. Available actions: stats, users'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST endpoint for admin actions
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken || !session?.user?.name) {
      return NextResponse.json(
        { error: 'Unauthorized - Login required' },
        { status: 401 }
      )
    }

    const securityConfig = {
      allowedOwners: ['samirpatel'], // Add other authorized maintainers here
      requiredScopes: ['read:user', 'user:email', 'public_repo'],
      rateLimitPerHour: 100
    }

    const githubSecurity = new GitHubSecurity(session.accessToken, securityConfig)
    
    // Verify user is authorized to perform admin actions
    const isAuthorized = await githubSecurity.verifyMainRepoCollaboratorAccess(session.user.name)
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden - Only repository collaborators can perform admin actions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'secure_repository':
        // Secure a user repository
        if (!data.username || !data.repository) {
          return NextResponse.json(
            { error: 'Missing username or repository' },
            { status: 400 }
          )
        }

        const result = await githubSecurity.secureUserRepository(data.username, data.repository)
        return NextResponse.json(result)

      case 'verify_permissions':
        // Verify a user's repository permissions
        if (!data.username || !data.repository) {
          return NextResponse.json(
            { error: 'Missing username or repository' },
            { status: 400 }
          )
        }

        const hasAccess = await githubSecurity.verifyUserRepositoryAccess(data.username, data.repository)
        return NextResponse.json({ hasAccess, username: data.username, repository: data.repository })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Available actions: secure_repository, verify_permissions' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Admin POST API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
