import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { GitHubService } from '@/lib/github/GitHubService'
import { SocialService } from '@/lib/services/SocialService'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken || !session?.user?.name) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, images, mentions, hashtags } = body

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Content is required' }, 
        { status: 400 }
      )
    }

    const githubService = new GitHubService(session.accessToken)
    
    // Create post data
    const postData = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      images: images || [],
      mentions: mentions || [],
      hashtags: hashtags || [],
      timestamp: new Date().toISOString()
    }

    // Create the post in the user's repository
    const result = await githubService.createPost(session.user.name, postData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error }, 
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      post: result.content,
      message: 'Post created successfully'
    })

  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken || !session?.user?.name) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const socialService = new SocialService(session.accessToken)
    
    // Get user's feed data
    const result = await socialService.getFeedData(session.user.name)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error }, 
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      posts: result.posts || []
    })

  } catch (error) {
    console.error('Error getting feed:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
