import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { prisma } from '../../../lib/prisma'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body
    
    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }
    
    // Vérifier l'utilisateur
    const user = await prisma.adminUser.findUnique({
      where: { username }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 }
      )
    }
    
    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 }
      )
    }
    
    // Créer une session
    const sessionId = randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Expire dans 7 jours
    
    await prisma.adminSession.create({
      data: {
        id: sessionId,
        admin_user_id: user.id,
        expires_at: expiresAt
      }
    });
    
    // Définir le cookie de session
    (await cookies()).set({
      name: 'admin_session',
      value: sessionId,
      httpOnly: true,
      path: '/',
      expires: expiresAt,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
} 