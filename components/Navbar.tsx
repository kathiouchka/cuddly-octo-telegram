'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-brick-red">
          Galerie Marocaine
        </Link>
        
        <div className="flex space-x-4">
          <Link href="/" className="text-olive-green hover:text-terracotta transition-colors">
            Accueil
          </Link>
          <Link href="/admin/login" className="text-olive-green hover:text-terracotta transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
} 