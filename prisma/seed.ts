import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Créer un utilisateur admin
  const adminExists = await prisma.adminUser.findUnique({
    where: { username: 'admin' },
  })
  
  if (!adminExists) {
    const passwordHash = await bcrypt.hash('admin123', 10)
    
    await prisma.adminUser.create({
      data: {
        username: 'admin',
        password_hash: passwordHash,
      },
    })
    
    console.log('Utilisateur admin créé avec succès')
  } else {
    console.log('L\'utilisateur admin existe déjà')
  }
  
  // Ajouter des données de démonstration si nécessaire
  const videosCount = await prisma.video.count()
  const tweetsCount = await prisma.tweet.count()
  const photosCount = await prisma.photo.count()
  
  if (videosCount === 0 && tweetsCount === 0 && photosCount === 0) {
    // Ajouter des vidéos de démonstration avec des URLs YouTube réelles
    await prisma.video.createMany({
      data: [
        {
          title: 'Marrakech - La ville rouge',
          description: 'Découvrez les merveilles de Marrakech, la ville rouge du Maroc',
          youtube_url: 'https://www.youtube.com/watch?v=LIDqDBpverc',
        },
        {
          title: 'Cuisine marocaine traditionnelle',
          description: 'Apprenez à préparer un tajine marocain authentique',
          youtube_url: 'https://www.youtube.com/watch?v=cQHzAYfTNc4',
        },
        {
          title: 'Fès - La ville impériale',
          description: 'Visite guidée de la médina de Fès, patrimoine mondial de l\'UNESCO',
          youtube_url: 'https://www.youtube.com/watch?v=Ww5M9aNtaA4',
        },
      ],
    })
    
    // Ajouter des tweets de démonstration
    await prisma.tweet.createMany({
      data: [
        {
          description: 'Actualités sur le tourisme au Maroc',
          tweet_url: 'https://twitter.com/Marokko_Info/status/1516396051893739520',
        },
        {
          description: 'Artisanat marocain',
          tweet_url: 'https://twitter.com/VisitMorocco/status/1499365433295572995',
        },
      ],
    })
    
    // Ajouter des photos de démonstration
    await prisma.photo.createMany({
      data: [
        {
          description: 'Médina de Fès',
          image_url: '/demo/fes-medina.jpg',
        },
        {
          description: 'Plage d\'Essaouira',
          image_url: '/demo/essaouira-beach.jpg',
        },
        {
          description: 'Montagnes de l\'Atlas',
          image_url: '/demo/atlas-mountains.jpg',
        },
      ],
    })
    
    console.log('Données de démonstration ajoutées avec succès')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })