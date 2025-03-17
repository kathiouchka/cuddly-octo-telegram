import React from 'react';
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import DeleteButton from '../../../components/admin/DeleteButton'

const prisma = new PrismaClient()

async function getTweets() {
  return await prisma.tweet.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      _count: {
        select: { comments: true }
      }
    }
  })
}

export default async function AdminTweets() {
  const tweets = await getTweets()
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brick-red">Gestion des tweets</h1>
        <Link 
          href="/admin/tweets/new" 
          className="bg-terracotta text-white px-4 py-2 rounded-md hover:bg-terracotta/90 transition-colors"
        >
          Ajouter un tweet
        </Link>
      </div>
      
      {tweets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Aucun tweet n'a été ajouté pour le moment.</p>
          <Link 
            href="/admin/tweets/new" 
            className="inline-block mt-4 text-terracotta hover:underline"
          >
            Ajouter votre premier tweet
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL Twitter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commentaires
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tweets.map((tweet) => (
                <tr key={tweet.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{tweet.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a 
                      href={tweet.tweet_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-terracotta hover:underline"
                    >
                      {tweet.tweet_url.substring(0, 30)}...
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tweet.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tweet._count.comments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        href={`/admin/tweets/edit/${tweet.id}`}
                        className="text-terracotta hover:text-terracotta/80"
                      >
                        Modifier
                      </Link>
                      <DeleteButton 
                        id={tweet.id} 
                        type="tweet" 
                        name={tweet.description}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 