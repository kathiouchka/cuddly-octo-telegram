import React from 'react';
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import DeleteButton from '../../../components/admin/DeleteButton'

const prisma = new PrismaClient()

async function getVideos() {
  return await prisma.video.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      _count: {
        select: { comments: true }
      }
    }
  })
}

export default async function AdminVideos() {
  const videos = await getVideos()
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brick-red">Gestion des vidéos</h1>
        <Link 
          href="/admin/videos/new" 
          className="bg-olive-green text-white px-4 py-2 rounded-md hover:bg-olive-green/90 transition-colors"
        >
          Ajouter une vidéo
        </Link>
      </div>
      
      {videos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Aucune vidéo n'a été ajoutée pour le moment.</p>
          <Link 
            href="/admin/videos/new" 
            className="inline-block mt-4 text-olive-green hover:underline"
          >
            Ajouter votre première vidéo
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
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
              {videos.map((video) => (
                <tr key={video.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{video.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 truncate max-w-xs">{video.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(video.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {video._count.comments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        href={`/admin/videos/edit/${video.id}`}
                        className="text-olive-green hover:text-olive-green/80"
                      >
                        Modifier
                      </Link>
                      <DeleteButton 
                        id={video.id} 
                        type="video" 
                        name={video.title}
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