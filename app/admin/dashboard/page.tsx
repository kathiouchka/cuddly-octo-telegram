import React from 'react';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

async function getStats() {
  const videosCount = await prisma.video.count()
  const tweetsCount = await prisma.tweet.count()
  const photosCount = await prisma.photo.count()
  const commentsCount = await prisma.comment.count()
  
  // Statistiques factices pour les visites
  const visitsCount = 1250
  
  return {
    videosCount,
    tweetsCount,
    photosCount,
    commentsCount,
    visitsCount,
  }
}

function StatCard({ title, count }: { title: string; count: number }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-brick-red mt-2">{count}</p>
    </div>
  )
}

function ContentTypeCard({ 
  title, 
  count, 
  icon, 
  link 
}: { 
  title: string; 
  count: number; 
  icon: string;
  link: string;
}) {
  return (
    <Link href={link} className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-olive-green mt-2">{count}</p>
      <p className="text-sm text-gray-500 mt-2">Gérer les {title.toLowerCase()}</p>
    </Link>
  )
}

export default async function AdminDashboard() {
  // Vérifier si l'utilisateur est connecté
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin_session')?.value
  
  if (!adminSession) {
    redirect('/admin/login')
  }
  
  const stats = await getStats()
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-brick-red mb-6">Tableau de bord administrateur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Contenus" count={stats.videosCount + stats.tweetsCount + stats.photosCount} />
        <StatCard title="Commentaires" count={stats.commentsCount} />
        <StatCard title="Visites" count={stats.visitsCount} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <ContentTypeCard 
          title="Vidéos" 
          count={stats.videosCount} 
          icon="🎬" 
          link="/admin/videos" 
        />
        <ContentTypeCard 
          title="Tweets" 
          count={stats.tweetsCount} 
          icon="🐦" 
          link="/admin/tweets" 
        />
        <ContentTypeCard 
          title="Photos" 
          count={stats.photosCount} 
          icon="📷" 
          link="/admin/photos" 
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-olive-green mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/admin/videos/new" 
            className="bg-olive-green text-white p-3 rounded-md text-center hover:bg-olive-green/90 transition-colors"
          >
            Ajouter une vidéo
          </Link>
          <Link 
            href="/admin/tweets/new" 
            className="bg-terracotta text-white p-3 rounded-md text-center hover:bg-terracotta/90 transition-colors"
          >
            Ajouter un tweet
          </Link>
          <Link 
            href="/admin/photos/new" 
            className="bg-brick-red text-white p-3 rounded-md text-center hover:bg-brick-red/90 transition-colors"
          >
            Ajouter une photo
          </Link>
        </div>
      </div>
    </div>
  )
}
