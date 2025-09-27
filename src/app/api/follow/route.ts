import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
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
    const { targetUsername, action } = body

    if (!targetUsername) {
      return NextResponse.json(
        { error: 'Target username is required' }, 
        { status: 400 }
      )
    }

    if (targetUsername === session.user.name) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' }, 
        { status: 400 }
      )
    }

    const socialService = new SocialService(session.accessToken)
    
    let result
    if (action === 'follow') {
      result = await socialService.followUser(session.user.name, targetUsername)
    } else if (action === 'unfollow') {
      result = await socialService.unfollowUser(session.user.name, targetUsername)
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be "follow" or "unfollow"' }, 
        { status: 400 }
      )
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error }, 
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}ed ${targetUsername}`
    })

  } catch (error) {
    console.error('Error with follow action:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
