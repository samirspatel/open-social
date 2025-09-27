import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { UserRegistryService } from '@/lib/services/UserRegistryService'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const userRegistry = new UserRegistryService(session.accessToken)
    const result = await userRegistry.getAllUsers()

    if (!result.success) {
      return NextResponse.json(
        { error: result.error }, 
        { status: 500 }
      )
    }

    // Filter out the current user from the results
    const filteredUsers = result.users?.filter(
      user => user.username !== session.user?.name
    ) || []

    return NextResponse.json({
      success: true,
      users: filteredUsers
    })

  } catch (error) {
    console.error('Error getting users:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
