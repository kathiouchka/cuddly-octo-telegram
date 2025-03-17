import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { validateUrl } from '../../../../utils/sanitize'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, youtube_url } = body
    
    // Validation
    if (!title || !description || !youtube_url) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }
    
    if (!validateUrl(youtube_url, 'youtube')) {
      return NextResponse.json(
        { error: 'URL YouTube invalide' },
        { status: 400 }
      )
    }
    
    // Créer la vidéo
    const video = await prisma.video.create({
      data: {
        title,
        description,
        youtube_url,
      },
    })
    
    return NextResponse.json(video)
  } catch (error) {
    console.error('Erreur lors de la création de la vidéo:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la vidéo' },
      { status: 500 }
    )
  }
} 