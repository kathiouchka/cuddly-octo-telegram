'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteButton({ 
  id, 
  type, 
  name 
}: { 
  id: number
  type: 'video' | 'tweet' | 'photo'
  name: string
}) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  
  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/admin/${type}s/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }
      
      // Rafraîchir la page pour mettre à jour la liste
      router.refresh()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Une erreur est survenue lors de la suppression')
    } finally {
      setIsDeleting(false)
      setIsConfirming(false)
    }
  }
  
  if (isConfirming) {
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => setIsConfirming(false)}
          className="text-gray-600 hover:text-gray-800"
        >
          Annuler
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800"
          disabled={isDeleting}
        >
          {isDeleting ? 'Suppression...' : 'Confirmer'}
        </button>
      </div>
    )
  }
  
  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="text-red-600 hover:text-red-800"
    >
      Supprimer
    </button>
  )
} 