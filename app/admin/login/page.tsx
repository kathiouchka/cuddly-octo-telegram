'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  // Check if user is already logged in when component mounts
  React.useEffect(() => {
    console.log('🔄 Login page useEffect running')
    let isMounted = true;
    
    // Check if admin session exists
    const checkSession = async () => {
      console.log('🔍 Checking admin session')
      try {
        const response = await fetch('/api/admin/check-session', {
          method: 'GET',
          credentials: 'include', // Important to include cookies
        });
        
        console.log('📡 Session check response:', response.status, response.statusText)
        
        if (!isMounted) return;
        
        if (response.ok) {
          console.log('✅ Session valid, redirecting to dashboard')
          // If session is valid, redirect to dashboard
          router.push('/admin/dashboard');
        } else {
          console.log('❌ No valid session found, staying on login page')
        }
      } catch (err) {
        // If error, user is not logged in, so do nothing
        console.error('🔥 Session check error:', err);
      }
    };
    
    checkSession();
    
    return () => {
      isMounted = false;
    };
  }, [router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!username.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs')
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur de connexion')
      }
      
      // Redirection vers le tableau de bord
      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(err.message || 'Identifiants incorrects')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-brick-red mb-6 text-center">Connexion Admin</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Nom d'utilisateur
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-olive-green"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-olive-green"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-olive-green text-white py-2 rounded-md hover:bg-olive-green/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
} 