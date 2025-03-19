# Galerie de Contenu Marocaine

Une application web pour partager et afficher du contenu avec une esthétique marocaine, construite avec Next.js, Prisma et TailwindCSS. Le site permet de présenter des vidéos YouTube, des tweets et des photos dans un style inspiré par le design marocain.

## Fonctionnalités

- Affichage de contenu dans une grille style Pinterest
- Support pour plusieurs types de contenu :
  - Vidéos YouTube
  - Tweets
  - Photos
- Système de commentaires
- Panel d'administration sécurisé
- Design inspiré par les couleurs traditionnelles marocaines
- Interface bilingue (Français)

## Prérequis

- Node.js (version 18.x ou supérieure recommandée)
- npm ou yarn
- Une base de données PostgreSQL (ou SQLite pour le développement)

## Installation

1. Clonez le dépôt
```bash
git clone [votre-url-de-repo]
cd galerie-marocaine
```

2. Installez les dépendances
```bash
npm install
# ou
yarn install
```

3. Configurez les variables d'environnement
Créez un fichier `.env` à la racine du projet avec les variables suivantes :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/galerie-marocaine"
# Pour le développement avec SQLite, vous pouvez utiliser :
# DATABASE_URL="file:./dev.db"
```

4. Initialisez la base de données
```bash
npx prisma migrate dev
npx prisma generate
```

5. (Optionnel) Chargez les données de démonstration
```bash
npm run seed
```

## Démarrage du Développement

1. Lancez le serveur de développement
```bash
npm run dev
# ou
yarn dev
```

2. Ouvrez votre navigateur et accédez à `http://localhost:3000`

## Technologies Utilisées

- **Frontend**:
  - Next.js 15.2
  - React 18.2
  - TailwindCSS
  - Police Roboto (Google Fonts)

- **Backend**:
  - Prisma (ORM)
  - bcryptjs (Cryptage)
  - API Routes Next.js

- **Style**:
  - Palette de couleurs marocaines personnalisée:
    - Brick Red (#A52A2A)
    - Olive Green (#556B2F)
    - Warm Sand (#E1C699)
    - Terracotta (#E2725B)

## Structure du Projet

- `/app` - Pages et composants Next.js
- `/components` - Composants React réutilisables
- `/prisma` - Schéma de base de données et migrations
- `/public` - Fichiers statiques et images de démonstration

## Scripts Disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Crée une version de production
- `npm run start` - Démarre le serveur de production
- `npm run lint` - Vérifie le code avec ESLint
- `npm run seed` - Charge les données de démonstration

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

[Votre type de licence]

## Contact

[Vos informations de contact]
