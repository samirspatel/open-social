import { NextRequest, NextResponse } from 'next/server'
import { GitHubSecurity } from '@/lib/security/GitHubSecurity'
import { headers } from 'next/headers'

/**
 * GitHub webhook endpoint for secure real-time updates
 * Verifies webhook signatures and processes authorized events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = headers()
    
    const signature = headersList.get('x-hub-signature-256')
    const event = headersList.get('x-github-event')
    const delivery = headersList.get('x-github-delivery')

    if (!signature) {
      console.warn('Webhook received without signature')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('GITHUB_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    const isValidSignature = GitHubSecurity.verifyWebhookSignature(body, signature, webhookSecret)
    if (!isValidSignature) {
      console.warn('Invalid webhook signature received')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      )
    }

    // Parse webhook payload
    let payload
    try {
      payload = JSON.parse(body)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      )
    }

    // Process different webhook events
    switch (event) {
      case 'push':
        await handlePushEvent(payload)
        break
        
      case 'repository':
        await handleRepositoryEvent(payload)
        break
        
      case 'member':
        await handleMemberEvent(payload)
        break
        
      default:
        console.log(`Received unhandled webhook event: ${event}`)
    }

    return NextResponse.json({ 
      success: true, 
      event,
      delivery,
      message: 'Webhook processed successfully'
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Handle push events to user repositories
 */
async function handlePushEvent(payload: any) {
  const repository = payload.repository
  const pusher = payload.pusher

  // Only process pushes to open-social-data repositories
  if (repository.name === 'open-social-data') {
    console.log(`Social data updated for user: ${repository.owner.login}`)
    
    // Here you could trigger cache invalidation, notifications, etc.
    // For example:
    // - Invalidate user feed cache
    // - Send notifications to followers
    // - Update search indices
  }
}

/**
 * Handle repository events (created, deleted, etc.)
 */
async function handleRepositoryEvent(payload: any) {
  const action = payload.action
  const repository = payload.repository

  if (action === 'created' && repository.name === 'open-social-data') {
    console.log(`New open-social-data repository created: ${repository.full_name}`)
    // Could trigger welcome workflows, setup verification, etc.
  }
  
  if (action === 'deleted' && repository.name === 'open-social-data') {
    console.log(`Social-data repository deleted: ${repository.full_name}`)
    // Could trigger cleanup in user registry
  }
}

/**
 * Handle member/collaborator events
 */
async function handleMemberEvent(payload: any) {
  const action = payload.action
  const member = payload.member
  const repository = payload.repository

  console.log(`Member ${action}: ${member.login} on ${repository.full_name}`)
  
  // Monitor for unauthorized access attempts
  if (repository.name === 'open-social' && action === 'added') {
    console.log(`New collaborator added to main repo: ${member.login}`)
    // Could send notifications to maintainers
  }
}
