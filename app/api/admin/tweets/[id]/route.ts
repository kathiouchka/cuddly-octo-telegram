import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { validateUrl } from '@/utils/sanitize'

const prisma = new PrismaClient()

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      )
    }
    
    // Supprimer le tweet (les commentaires seront supprimés automatiquement grâce à la relation onDelete: Cascade)
    await prisma.tweet.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression du tweet:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du tweet' },
      { status: 500 }
    )
  }
} 