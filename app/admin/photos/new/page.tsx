'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function NewPhoto() {
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    
    if (selectedFile) {
      // Vérifier si c'est une image
      if (!selectedFile.type.startsWith('image/')) {
        setError('Veuillez sélectionner une image valide')
        return
      }
      
      setFile(selectedFile)
      
      // Créer un aperçu
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (!description.trim() || !file) {
      setError('Tous les champs sont requis')
      return
    }
    
    setIsLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('description', description)
      formData.append('file', file)
      
      const response = await fetch('/api/admin/photos', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de l\'ajout de la photo')
      }
      
      // Redirection vers la liste des photos
      router.push('/admin/photos')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-brick-red mb-6">Ajouter une photo</h1>
      
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
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brick-red"
              rows={3}
              required
            />
          </div>
          
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brick-red"
              required
            />
          </div>
          
          {preview && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Aperçu :</p>
              <div className="relative h-48 w-full">
                <Image
                  src={preview}
                  alt="Aperçu"
                  fill
                  className="object-contain rounded-md"
                />
              </div>
            </div>
          )}
          
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
              className="px-4 py-2 bg-brick-red text-white rounded-md hover:bg-brick-red/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Ajout en cours...' : 'Ajouter la photo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 