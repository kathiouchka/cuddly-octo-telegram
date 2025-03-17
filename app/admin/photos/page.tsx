import React from 'react';
import { prisma } from '../../lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import DeleteButton from '../../../components/admin/DeleteButton'


async function getPhotos() {
  return await prisma.photo.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      _count: {
        select: { comments: true }
      }
    }
  })
}

export default async function AdminPhotos() {
  const photos = await getPhotos()
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brick-red">Gestion des photos</h1>
        <Link 
          href="/admin/photos/new" 
          className="bg-brick-red text-white px-4 py-2 rounded-md hover:bg-brick-red/90 transition-colors"
        >
          Ajouter une photo
        </Link>
      </div>
      
      {photos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Aucune photo n'a été ajoutée pour le moment.</p>
          <Link 
            href="/admin/photos/new" 
            className="inline-block mt-4 text-brick-red hover:underline"
          >
            Ajouter votre première photo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={photo.image_url.startsWith('/') ? photo.image_url : `/uploads/${photo.image_url}`}
                  alt={photo.description}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-gray-900">{photo.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(photo.created_at).toLocaleDateString()} • {photo._count.comments} commentaires
                </p>
                <div className="flex justify-end space-x-2 mt-3">
                  <Link 
                    href={`/admin/photos/edit/${photo.id}`}
                    className="text-brick-red hover:text-brick-red/80 text-sm"
                  >
                    Modifier
                  </Link>
                  <DeleteButton 
                    id={photo.id} 
                    type="photo" 
                    name={photo.description}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 