import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { validateUrl } from '../../../../utils/sanitize'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { description, tweet_url } = body
    
    // Validation
    if (!description || !tweet_url) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }
    
    if (!validateUrl(tweet_url, 'twitter')) {
      return NextResponse.json(
        { error: 'URL Twitter invalide' },
        { status: 400 }
      )
    }
    
    // Créer le tweet
    const tweet = await prisma.tweet.create({
      data: {
        description,
        tweet_url,
      },
    })
    
    return NextResponse.json(tweet)
  } catch (error) {
    console.error('Erreur lors de la création du tweet:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du tweet' },
      { status: 500 }
    )
  }
} 