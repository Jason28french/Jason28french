'use client'

import { useEffect, useRef, useState } from 'react'

export default function LiveStream() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: true 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsStreaming(true)
    } catch (err) {
      setError('Impossible d\'accéder à la webcam. Veuillez vérifier les permissions.')
      console.error('Erreur webcam:', err)
    }
  }

  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsStreaming(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-black rounded-lg overflow-hidden aspect-video relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <button
              onClick={startStream}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Démarrer le Live
            </button>
          </div>
        )}
        {isStreaming && (
          <button
            onClick={stopStream}
            className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Arrêter
          </button>
        )}
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
} 