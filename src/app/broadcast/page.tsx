'use client'

import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

const STREAMING_SERVER = process.env.NEXT_PUBLIC_STREAMING_SERVER || 'http://localhost:3001'

export default function BroadcastPage() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [viewers, setViewers] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const socketRef = useRef<any>(null)

  const startStream = async () => {
    try {
      // Accès à la webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      // Connexion au serveur Socket.IO
      socketRef.current = io(STREAMING_SERVER)
      
      socketRef.current.on('connect', () => {
        console.log('Connecté au serveur de streaming')
        socketRef.current.emit('broadcaster')
      })

      socketRef.current.on('viewer-count', (count: number) => {
        setViewers(count)
      })

      setIsStreaming(true)
      setError(null)
    } catch (err) {
      console.error('Erreur lors du démarrage du stream:', err)
      setError('Erreur lors du démarrage du stream. Veuillez vérifier vos permissions de caméra.')
    }
  }

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      streamRef.current = null
    }

    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }

    setIsStreaming(false)
    setViewers(0)
  }

  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          Mode Diffusion
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative aspect-video bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white text-lg mb-4">Prêt à diffuser ?</p>
                  <button
                    onClick={startStream}
                    className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  >
                    Démarrer le streaming
                  </button>
                </div>
              </div>
            )}
            {isStreaming && (
              <div className="absolute bottom-4 right-4 flex items-center space-x-4">
                <span className="text-white bg-black/50 px-4 py-2 rounded-full">
                  {viewers} spectateur{viewers !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={stopStream}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Arrêter
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="mt-8 text-center text-gray-600">
          <p>Partagez ce lien avec vos spectateurs :</p>
          <code className="mt-2 block p-4 bg-gray-100 rounded-lg">
            {typeof window !== 'undefined' ? 
              `${window.location.origin}/watch` : 
              'Chargement...'}
          </code>
        </div>
      </div>
    </div>
  )
} 