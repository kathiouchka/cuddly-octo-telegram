import React from 'react';
import './globals.css'
import { roboto } from './fonts'
import Navbar from '../components/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Le wall de Kathiou',
  description: 'Tous les bails que je kiff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${roboto.variable} font-roboto bg-warm-sand/10 min-h-screen`}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
} 