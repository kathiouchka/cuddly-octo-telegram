import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const description = formData.get('description') as string
    const file = formData.get('file') as File
    
    // Validation
    if (!description || !file) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }
    
    // Vérifier si c'est une image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Le fichier doit être une image' },
        { status: 400 }
      )
    }
    
    // Créer le dossier uploads s'il n'existe pas
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }
    
    // Générer un nom de fichier unique
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const filePath = join(uploadDir, fileName)
    
    // Lire le contenu du fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Écrire le fichier sur le disque
    await writeFile(filePath, buffer)
    
    // Créer l'entrée dans la base de données
    const photo = await prisma.photo.create({
      data: {
        description,
        image_url: `/uploads/${fileName}`,
      },
    })
    
    return NextResponse.json(photo)
  } catch (error) {
    console.error('Erreur lors de la création de la photo:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la photo' },
      { status: 500 }
    )
  }
} 