import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '../lib/prisma'
import { headers } from 'next/headers'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: any
}) {
  // Get the current path from headers or URL
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const referer = headersList.get("referer") || "";
  
  console.log('🔍 Admin layout rendering for path:', pathname);
  console.log('🔗 Referer:', referer);
  
  // Check if we're on the login page by examining the URL path components
  const isLoginPage = pathname === "/admin/login" || 
                      referer.includes("/admin/login") || 
                      // This is a more reliable way to detect the login page
                      (typeof window !== 'undefined' && window.location.pathname.endsWith('/admin/login'));
  
  console.log('🔑 Is login page?', isLoginPage);
  
  // Skip authentication for login page
  if (isLoginPage) {
    console.log('🔑 Login page detected, skipping auth check');
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }
  
  // Vérifier si l'utilisateur est connecté
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin_session')
  console.log('🍪 Admin session cookie found:', adminSession ? 'yes' : 'no')
  
  if (!adminSession?.value && !process.env.SKIP_AUTH) {
    console.log('❌ No valid session, redirecting to login')
    redirect('/admin/login')
  }
  
  // Verify the session exists in the database
  if (adminSession?.value) {
    try {
      const session = await prisma.adminSession.findUnique({
        where: { id: adminSession.value },
        include: { admin_user: true }
      })
      
      // If session doesn't exist or is expired, redirect to login
      if (!session || new Date() > session.expires_at) {
        console.log('⏰ Session invalid or expired, clearing cookie');
        (await cookies()).set('admin_session', '', { expires: new Date(0), path: '/' })
        redirect('/admin/login')
      }
      
      console.log('✅ Valid session for user:', session.admin_user.username)
    } catch (error) {
      console.error('🔥 Error verifying admin session:', error);
      (await cookies()).delete('admin_session')
      redirect('/admin/login')
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-olive-green text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/admin/dashboard" className="text-xl font-bold">
            Administration
          </Link>
          
          <nav className="flex space-x-4">
            <Link href="/admin/videos" className="hover:underline">
              Vidéos
            </Link>
            <Link href="/admin/tweets" className="hover:underline">
              Tweets
            </Link>
            <Link href="/admin/photos" className="hover:underline">
              Photos
            </Link>
            <Link href="/api/admin/logout" className="hover:underline">
              Déconnexion
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
      
      <footer className="bg-gray-100 py-4 text-center text-gray-600 text-sm">
        Panneau d'administration - Galerie Marocaine
      </footer>
    </div>
  )
} 