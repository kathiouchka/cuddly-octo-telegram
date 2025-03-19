import React from 'react';
import { PrismaClient } from '@prisma/client'
import Card from '../components/Card'

const prisma = new PrismaClient()

async function getContent() {
  const videos = await prisma.video.findMany({
    orderBy: { created_at: 'desc' },
  })
  
  const tweets = await prisma.tweet.findMany({
    orderBy: { created_at: 'desc' },
  })
  
  const photos = await prisma.photo.findMany({
    orderBy: { created_at: 'desc' },
  })
  
  // Combine and shuffle content for Pinterest-like layout
  const allContent = [
    ...videos.map(v => ({ ...v, type: 'video' })),
    ...tweets.map(t => ({ ...t, type: 'tweet' })),
    ...photos.map(p => ({ ...p, type: 'photo' })),
  ].sort(() => Math.random() - 0.5)
  
  return allContent
}

export default async function Home() {
  const content = await getContent()
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-brick-red mb-8 text-center">Bails</h1>
      
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {content.map((item: any) => (
          <div key={`${item.type}-${item.id}`} className="break-inside-avoid mb-4">
            <Card item={item} />
          </div>
        ))}
      </div>
    </div>
  )
} 