'use client'

import { useState, useEffect, useRef } from 'react'

export default function LiveStream() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewers, setViewers] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: true 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      streamRef.current = stream
      setIsStreaming(true)
      setError(null)

      // Connexion au serveur WebSocket
      const ws = new WebSocket('ws://localhost:3001')
      wsRef.current = ws

      ws.onopen = () => {
        console.log('Connecté au serveur de streaming')
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'viewerCount') {
          setViewers(data.count)
        }
      }

      // Envoyer les frames vidéo
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = 640
      canvas.height = 480

      const sendFrame = () => {
        if (context && videoRef.current && ws.readyState === WebSocket.OPEN) {
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
          const frame = canvas.toDataURL('image/jpeg', 0.5)
          ws.send(JSON.stringify({ type: 'frame', data: frame }))
        }
        requestAnimationFrame(sendFrame)
      }

      sendFrame()
    } catch (err) {
      setError('Erreur lors de l\'accès à la webcam. Veuillez vérifier vos permissions.')
      console.error('Erreur de streaming:', err)
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

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
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
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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