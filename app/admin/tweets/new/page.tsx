'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { validateUrl } from '../../../../utils/sanitize'

export default function NewTweet() {
  const [description, setDescription] = useState('')
  const [tweetUrl, setTweetUrl] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (!description.trim() || !tweetUrl.trim()) {
      setError('Tous les champs sont requis')
      return
    }
    
    if (!validateUrl(tweetUrl, 'twitter')) {
      setError('URL Twitter invalide')
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/admin/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          tweet_url: tweetUrl,
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de l\'ajout du tweet')
      }
      
      // Redirection vers la liste des tweets
      router.push('/admin/tweets')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-brick-red mb-6">Ajouter un tweet</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-terracotta"
              rows={3}
              required
            />
          </div>
          
          <div>
            <label htmlFor="tweetUrl" className="block text-sm font-medium text-gray-700 mb-1">
              URL Twitter
            </label>
            <input
              id="tweetUrl"
              type="url"
              value={tweetUrl}
              onChange={(e) => setTweetUrl(e.target.value)}
              placeholder="https://twitter.com/username/status/1234567890"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-terracotta"
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
              className="px-4 py-2 bg-terracotta text-white rounded-md hover:bg-terracotta/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Ajout en cours...' : 'Ajouter le tweet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 