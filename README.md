# Jason Project

Une application de streaming en direct avec authentification utilisateur.

## Fonctionnalités

- Inscription et connexion des utilisateurs
- Différents rôles utilisateur (spectateur et diffuseur)
- Streaming en direct via webcam
- Interface utilisateur moderne et responsive

## Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL
- npm ou yarn

## Installation

1. Clonez le repository :
```bash
git clone https://github.com/Jason28french/Jason28french.git
cd Jason28french
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez la base de données :
   - Créez une base de données PostgreSQL
   - Copiez le fichier `.env.example` vers `.env`
   - Mettez à jour les variables d'environnement dans `.env` avec vos informations de connexion

4. Initialisez la base de données :
```bash
npx prisma migrate dev
```

5. Lancez le serveur de développement :
```bash
npm run dev
```

6. Dans un autre terminal, lancez le serveur de streaming :
```bash
npm run streaming-server
```

## Structure du projet

- `/src/app` - Pages et routes de l'application
- `/src/components` - Composants React réutilisables
- `/src/lib` - Utilitaires et configurations
- `/prisma` - Schéma et migrations de la base de données

## Rôles utilisateur

- **Spectateur** : Peut regarder les diffusions en direct
- **Diffuseur** : Peut diffuser sa webcam en direct

## Sécurité

- Authentification JWT
- Hachage des mots de passe avec bcrypt
- Protection des routes avec middleware
- Validation des données

## Technologies utilisées

- Next.js
- React
- TypeScript
- Prisma
- PostgreSQL
- Socket.IO
- WebRTC
- Tailwind CSS

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

MIT 