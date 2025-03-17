import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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
    
    // Récupérer la photo existante
    const photo = await prisma.photo.findUnique({
      where: { id },
    })
    
    if (!photo) {
      return NextResponse.json(
        { error: 'Photo non trouvée' },
        { status: 404 }
      )
    }
    
    // Supprimer le fichier si c'est une image uploadée
    if (photo.image_url.startsWith('/uploads/')) {
      const filePath = join(process.cwd(), 'public', photo.image_url)
      if (existsSync(filePath)) {
        await unlink(filePath)
      }
    }
    
    // Supprimer la photo (les commentaires seront supprimés automatiquement grâce à la relation onDelete: Cascade)
    await prisma.photo.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression de la photo:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la photo' },
      { status: 500 }
    )
  }
} 