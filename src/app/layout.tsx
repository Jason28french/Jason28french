import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jason - Modèle Français | OnlyFans & Réseaux Sociaux',
  description: 'Découvrez Jason, modèle français exclusif. Contenu premium sur OnlyFans, photos et vidéos exclusives. Suivez-moi sur Instagram et Twitter pour plus de contenu.',
  keywords: 'Jason, modèle français, OnlyFans, influenceur, photos exclusives, contenu premium',
  openGraph: {
    title: 'Jason - Modèle Français | OnlyFans & Réseaux Sociaux',
    description: 'Découvrez Jason, modèle français exclusif. Contenu premium sur OnlyFans, photos et vidéos exclusives.',
    images: ['/images/profile.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jason - Modèle Français | OnlyFans & Réseaux Sociaux',
    description: 'Découvrez Jason, modèle français exclusif. Contenu premium sur OnlyFans.',
    images: ['/images/profile.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  )
} 