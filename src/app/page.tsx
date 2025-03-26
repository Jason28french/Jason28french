import Image from 'next/image'
import Link from 'next/link'
import Gallery from '@/components/Gallery'
import Contact from '@/components/Contact'
import LiveStream from '@/components/LiveStream'
import StreamViewer from '@/components/StreamViewer'
import AgeVerification from '@/components/AgeVerification'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">
          Bienvenue sur Jason Project
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Diffuseur</h2>
            <p className="text-gray-600 mb-4">
              Accédez à la page de diffusion pour partager votre webcam en direct.
            </p>
            <Link
              href="/broadcast"
              className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Commencer la diffusion
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Spectateur</h2>
            <p className="text-gray-600 mb-4">
              Regardez les diffusions en direct des diffuseurs.
            </p>
            <Link
              href="/watch"
              className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Voir les diffusions
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Vous n'avez pas encore de compte ?
          </p>
          <div className="space-x-4">
            <Link
              href="/register"
              className="inline-block bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition-colors"
            >
              S'inscrire
            </Link>
            <Link
              href="/login"
              className="inline-block bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
} 