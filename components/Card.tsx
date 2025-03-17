'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import CommentSection from './CommentSection'

export default function Card({ item }: { item: any }) {
  const [isVisible, setIsVisible] = useState(false)
  const [showComments, setShowComments] = useState(false)
  
  useEffect(() => {
    // Simple fade-in animation
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Fonction pour extraire l'ID de la vidéo YouTube
  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }
  
  // Render content based on type
  const renderContent = () => {
    switch (item.type) {
      case 'video':
        const videoId = getYoutubeVideoId(item.youtube_url)
        return (
          <div className="video-container rounded-t-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="border-0"
            ></iframe>
          </div>
        )
      case 'tweet':
        return (
          <div className="p-4 bg-blue-50 rounded-t-lg">
            <p className="text-gray-600 italic">"{item.description}"</p>
            <a
              href={item.tweet_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 text-sm hover:underline mt-2 inline-block"
            >
              Voir sur Twitter
            </a>
          </div>
        )
      case 'photo':
        return (
          <div className="relative aspect-square">
            <Image
              src={item.image_url.startsWith('/') ? item.image_url : `/uploads/${item.image_url}`}
              alt={item.description}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-t-lg"
            />
          </div>
        )
      default:
        return <div>Type de contenu non pris en charge</div>
    }
  }
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${isVisible ? 'fade-in' : 'opacity-0'}`}>
      {renderContent()}
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">
          {item.title || item.description}
        </h3>
        
        {item.type === 'video' && (
          <p className="mt-1 text-sm text-gray-500">{item.description}</p>
        )}
        
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {new Date(item.created_at).toLocaleDateString()}
          </span>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-olive-green hover:underline"
          >
            {showComments ? 'Masquer les commentaires' : 'Afficher les commentaires'}
          </button>
        </div>
        
        {showComments && (
          <CommentSection contentType={item.type} contentId={item.id} />
        )}
      </div>
    </div>
  )
} 