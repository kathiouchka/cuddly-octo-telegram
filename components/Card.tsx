'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import CommentSection from './CommentSection'

export default function Card({ item }: { item: any }) {
  const [isVisible, setIsVisible] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [tweetHtml, setTweetHtml] = useState<string>('')
  const [isTweetLoading, setIsTweetLoading] = useState(false)
  
  useEffect(() => {
    // Simple fade-in animation
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    
    // Load tweet if necessary
    if (item.type === 'tweet' && item.tweet_url) {
      loadTweet(item.tweet_url)
    }
    
    return () => clearTimeout(timer)
  }, [item])
  
  // Function to load tweet using oEmbed
  const loadTweet = async (tweetUrl: string) => {
    setIsTweetLoading(true)
    
    try {
      // Try to get from localStorage first
      const cacheKey = `tweet_${tweetUrl}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        try {
          const { html, timestamp } = JSON.parse(cachedData);
          const cacheAge = Date.now() - timestamp;
          
          // Use cache if it's less than a week old
          if (cacheAge < 7 * 24 * 60 * 60 * 1000) {
            setTweetHtml(html);
            
            // Load Twitter JS
            loadTwitterScript();
            
            // We still have data, so we can return early
            setIsTweetLoading(false);
            return;
          }
        } catch (e) {
          // Invalid cache data, continue to fetch
          console.warn('Invalid cache data', e);
        }
      }
      
      // Fetch from API if no valid cache
      const response = await fetch(`/api/tweet-proxy?url=${encodeURIComponent(tweetUrl)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tweet data');
      }
      
      const data = await response.json();
      setTweetHtml(data.html);
      
      // Save to localStorage
      localStorage.setItem(cacheKey, JSON.stringify({
        html: data.html,
        timestamp: Date.now()
      }));
      
      // Load Twitter JS
      loadTwitterScript();
      
    } catch (error) {
      console.error("Error loading tweet:", error);
    } finally {
      setIsTweetLoading(false);
    }
  };
  
  // Helper function to load Twitter script
  const loadTwitterScript = () => {
    if (typeof window !== 'undefined') {
      if (!window.twttr) {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        document.body.appendChild(script);
      } else {
        // If Twitter script already loaded, tell it to process new tweets
        window.twttr.widgets.load();
      }
    }
  };
  
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
            {isTweetLoading ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : tweetHtml ? (
              <div 
                className="tweet-container" 
                dangerouslySetInnerHTML={{ __html: tweetHtml }}
              />
            ) : (
              <div className="tweet-fallback">
                <p className="text-gray-600 italic">"{item.description}"</p>
                <p className="text-red-500 text-sm mt-2">
                  Le tweet n'a pas pu être chargé. 
                </p>
                <a
                  href={item.tweet_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm hover:underline mt-1 inline-block"
                >
                  Voir sur Twitter
                </a>
              </div>
            )}
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
          {item.type === 'tweet' ? 'Tweet' : (item.title || item.description)}
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

// Add TypeScript interface for window.twttr
declare global {
  interface Window {
    twttr: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
} 