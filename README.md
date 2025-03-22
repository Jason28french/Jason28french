# Site Web de Jason

Un site web moderne et professionnel pour Jason, le modèle français avec le plus beau booty de France.

## Technologies Utilisées

- Next.js 14
- TypeScript
- Tailwind CSS
- React

## Prérequis

- Node.js 18.0.0 ou supérieur
- npm ou yarn

## Installation

1. Clonez le repository :
```bash
git clone [URL_DU_REPO]
cd jason-website
```

2. Installez les dépendances :
```bash
npm install
# ou
yarn install
```

3. Créez un fichier `.env.local` à la racine du projet et ajoutez vos variables d'environnement :
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Lancez le serveur de développement :
```bash
npm run dev
# ou
yarn dev
```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du Projet

```
jason-website/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── components/
│       ├── Navigation.tsx
│       ├── Gallery.tsx
│       └── Contact.tsx
├── public/
│   └── images/
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.ts
```

## Fonctionnalités

- Design responsive et moderne
- Navigation fluide
- Galerie de photos interactive
- Formulaire de contact
- Intégration des réseaux sociaux
- Optimisé pour le SEO

## Déploiement

Le site peut être déployé sur Vercel, Netlify ou tout autre service de déploiement compatible avec Next.js.

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

MIT 

npm run build
npm start 