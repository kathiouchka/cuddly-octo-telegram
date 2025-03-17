import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '../../../lib/prisma'

export async function GET(request: NextRequest) {
  console.log('🔍 check-session API called')
  try {
    // Get session cookie
    const sessionId = (await cookies()).get('admin_session')?.value
    console.log('🍪 Session cookie found:', sessionId ? 'yes' : 'no')
    
    if (!sessionId) {
      console.log('❌ No session cookie, returning 401')
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    
    // Check if session exists and is valid
    const session = await prisma.adminSession.findUnique({
      where: { id: sessionId },
      include: { admin_user: true }
    })
    
    // If no session or session expired
    if (!session || new Date() > session.expires_at) {
        console.log('⏰ Session invalid or expired, clearing cookie');
      // Clear invalid cookie
      (await cookies()).delete('admin_session')
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    
    console.log('✅ Session valid for user:', session.admin_user.username)
    // Session is valid
    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: session.admin_user.id,
        username: session.admin_user.username
      }
    })
    
  } catch (error) {
    console.error('🔥 Error checking session:', error)
    return NextResponse.json({ error: 'Error checking session' }, { status: 500 })
  }
} 