'use client'

import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

const STREAMING_SERVER = process.env.NEXT_PUBLIC_STREAMING_SERVER || 'http://localhost:3001'

export default function LiveStream() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [viewers, setViewers] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const socketRef = useRef<any>(null)
  const peerConnectionsRef = useRef<{ [key: string]: RTCPeerConnection }>({})

  const startStream = async () => {
    try {
      // Connexion au serveur Socket.IO
      socketRef.current = io(STREAMING_SERVER)
      
      // Configuration de la connexion Socket.IO
      socketRef.current.on('connect', () => {
        console.log('Connecté au serveur de streaming')
        socketRef.current.emit('broadcaster')
      })

      // Gestion des réponses WebRTC
      socketRef.current.on('answer', async (answer: RTCSessionDescriptionInit, viewerId: string) => {
        const pc = peerConnectionsRef.current[viewerId]
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer))
        }
      })

      // Gestion des candidats ICE
      socketRef.current.on('ice-candidate', async (candidate: RTCIceCandidateInit, viewerId: string) => {
        const pc = peerConnectionsRef.current[viewerId]
        if (pc) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate))
        }
      })

      // Gestion du nombre de spectateurs
      socketRef.current.on('viewer-count', (count: number) => {
        setViewers(count)
      })

      // Accès à la webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

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
      setIsStreaming(false)
    }

    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }

    // Fermeture des connexions WebRTC
    Object.values(peerConnectionsRef.current).forEach(pc => pc.close())
    peerConnectionsRef.current = {}
  }

  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                <p className="text-white mb-4">Prêt à diffuser ?</p>
                <button
                  onClick={startStream}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                >
                  Démarrer le streaming
                </button>
              </div>
            </div>
          )}
          {isStreaming && (
            <div className="absolute bottom-4 right-4 flex items-center space-x-4">
              <span className="text-white bg-black/50 px-3 py-1 rounded-full">
                {viewers} spectateur{viewers !== 1 ? 's' : ''}
              </span>
              <button
                onClick={stopStream}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Arrêter
              </button>
            </div>
          )}
        </div>
        {error && (
          <div className="p-4 bg-red-50 text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  )
} 