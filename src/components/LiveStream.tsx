'use client'

import { useState, useEffect, useRef } from 'react'

export default function LiveStream() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewers, setViewers] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({})

  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    try {
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      })

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          if (streamRef.current) {
            peerConnection.addTrack(track, streamRef.current)
          }
        })
      }

      peerConnection.onicecandidate = (event) => {
        if (event.candidate && wsRef.current) {
          wsRef.current.send(JSON.stringify({
            type: 'candidate',
            candidate: event.candidate
          }))
        }
      }

      await peerConnection.setRemoteDescription(offer)
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)

      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({
          type: 'answer',
          answer: answer
        }))
      }
    } catch (error) {
      console.error('Erreur lors de la gestion de l\'offre:', error)
      setError('Erreur lors de la connexion avec le spectateur')
    }
  }

  const handleCandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      if (peerConnections.current) {
        Object.values(peerConnections.current).forEach(async (pc) => {
          await pc.addIceCandidate(new RTCIceCandidate(candidate))
        })
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du candidat ICE:', error)
    }
  }

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
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('Connecté au serveur WebSocket')
        ws.send(JSON.stringify({ type: 'broadcaster' }))
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        switch (data.type) {
          case 'viewerCount':
            setViewers(data.count)
            break
          case 'offer':
            handleOffer(data.offer)
            break
          case 'candidate':
            handleCandidate(data.candidate)
            break
        }
      }

      ws.onerror = (error) => {
        console.error('Erreur WebSocket:', error)
        setError('Erreur de connexion au serveur')
      }

      ws.onclose = () => {
        console.log('Déconnecté du serveur WebSocket')
        setIsStreaming(false)
        setViewers(0)
      }

    } catch (error) {
      console.error('Erreur lors du démarrage du stream:', error)
      setError('Erreur lors de l\'accès à la webcam')
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

    Object.values(peerConnections.current).forEach(pc => pc.close())
    peerConnections.current = {}
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