'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { validateUrl } from '../../../../utils/sanitize'

export default function NewVideo() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (!title.trim() || !description.trim() || !youtubeUrl.trim()) {
      setError('Tous les champs sont requis')
      return
    }
    
    if (!validateUrl(youtubeUrl, 'youtube')) {
      setError('URL YouTube invalide')
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          youtube_url: youtubeUrl,
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de l\'ajout de la vidéo')
      }
      
      // Redirection vers la liste des vidéos
      router.push('/admin/videos')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-brick-red mb-6">Ajouter une vidéo</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titre
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-olive-green"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-olive-green"
              rows={3}
              required
            />
          </div>
          
          <div>
            <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-1">
              URL YouTube
            </label>
            <input
              id="youtubeUrl"
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-olive-green"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-olive-green text-white rounded-md hover:bg-olive-green/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Ajout en cours...' : 'Ajouter la vidéo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 