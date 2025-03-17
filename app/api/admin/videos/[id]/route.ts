import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

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
    
    // Supprimer la vidéo (les commentaires seront supprimés automatiquement grâce à la relation onDelete: Cascade)
    await prisma.video.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression de la vidéo:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la vidéo' },
      { status: 500 }
    )
  }
}