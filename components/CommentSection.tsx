'use client'

import React, { useState, useEffect } from 'react'
import { sanitizeInput } from '../utils/sanitize'

type Comment = {
  id: number
  comment_text: string
  created_at: string
}

export default function CommentSection({ 
  contentType, 
  contentId 
}: { 
  contentType: string
  contentId: number 
}) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    fetchComments()
  }, [contentType, contentId])
  
  const fetchComments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/comments?type=${contentType}&id=${contentId}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commentaires')
      }
      
      const data = await response.json()
      setComments(data)
    } catch (err) {
      setError('Impossible de charger les commentaires')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) return
    
    try {
      const sanitizedComment = sanitizeInput(newComment)
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
          comment_text: sanitizedComment,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du commentaire')
      }
      
      const addedComment = await response.json()
      setComments([...comments, addedComment])
      setNewComment('')
    } catch (err) {
      setError('Impossible d\'ajouter le commentaire')
      console.error(err)
    }
  }
  
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h4 className="text-md font-medium mb-3">Commentaires</h4>
      
      {isLoading ? (
        <p className="text-gray-500 text-sm">Chargement des commentaires...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucun commentaire pour le moment</p>
      ) : (
        <ul className="space-y-3 mb-4">
          {comments.map((comment) => (
            <li key={comment.id} className="bg-warm-sand/10 p-3 rounded-md">
              <p className="text-gray-800 text-sm">{comment.comment_text}</p>
              <p className="text-gray-500 text-xs mt-1">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
      
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="flex flex-col space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => {
              if (e.target.value.length <= 250) {
                setNewComment(e.target.value)
              }
            }}
            placeholder="Ajouter un commentaire (max 250 caractères)"
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-olive-green"
            rows={2}
            maxLength={250}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {newComment.length}/250 caractères
            </span>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="bg-olive-green text-white px-3 py-1 rounded-md text-sm hover:bg-olive-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Commenter
            </button>
          </div>
        </div>
      </form>
    </div>
  )
} 