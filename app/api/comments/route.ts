import { NextRequest, NextResponse } from 'next/server'
import { sanitizeInput } from '../../../utils/sanitize'
import { prisma } from '../../lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')
  const id = searchParams.get('id')
  
  if (!type || !id) {
    return NextResponse.json(
      { error: 'Type et ID requis' },
      { status: 400 }
    )
  }
  
  const contentId = parseInt(id)
  
  if (isNaN(contentId)) {
    return NextResponse.json(
      { error: 'ID invalide' },
      { status: 400 }
    )
  }
  
  try {
    let comments: any[] = []
    
    switch (type) {
      case 'video':
        comments = await prisma.comment.findMany({
          where: { video_id: contentId },
          orderBy: { created_at: 'desc' },
        })
        break
      case 'tweet':
        comments = await prisma.comment.findMany({
          where: { tweet_id: contentId },
          orderBy: { created_at: 'desc' },
        })
        break
      case 'photo':
        comments = await prisma.comment.findMany({
          where: { photo_id: contentId },
          orderBy: { created_at: 'desc' },
        })
        break
      default:
        return NextResponse.json(
          { error: 'Type de contenu non pris en charge' },
          { status: 400 }
        )
    }
    
    return NextResponse.json(comments)
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commentaires' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content_type, content_id, comment_text } = body
    
    // Validation
    if (!content_type || !content_id || !comment_text) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }
    
    const sanitizedComment = sanitizeInput(comment_text)
    
    if (sanitizedComment.length < 1) {
      return NextResponse.json(
        { error: 'Le commentaire ne peut pas être vide' },
        { status: 400 }
      )
    }
    
    // Créer le commentaire selon le type de contenu
    let comment
    
    switch (content_type) {
      case 'video':
        comment = await prisma.comment.create({
          data: {
            comment_text: sanitizedComment,
            video: { connect: { id: content_id } },
          },
        })
        break
      case 'tweet':
        comment = await prisma.comment.create({
          data: {
            comment_text: sanitizedComment,
            tweet: { connect: { id: content_id } },
          },
        })
        break
      case 'photo':
        comment = await prisma.comment.create({
          data: {
            comment_text: sanitizedComment,
            photo: { connect: { id: content_id } },
          },
        })
        break
      default:
        return NextResponse.json(
          { error: 'Type de contenu non pris en charge' },
          { status: 400 }
        )
    }
    
    return NextResponse.json(comment)
  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du commentaire' },
      { status: 500 }
    )
  }
} 