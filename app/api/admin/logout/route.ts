import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get('admin_session')?.value
    
    if (sessionId) {
      // Delete the session from the database
      await prisma.adminSession.delete({
        where: { id: sessionId }
      }).catch(() => {
        // Ignore errors if session doesn't exist
      })
      
      // Clear the cookie
      cookies().delete('admin_session')
    }
    
    // Redirect to login page
    return NextResponse.redirect(new URL('/admin/login', request.url))
  } catch (error) {
    console.error('Error during logout:', error)
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
} 