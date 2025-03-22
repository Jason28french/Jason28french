'use client'

import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'

export default function LiveStream() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewers, setViewers] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const socketRef = useRef<any>(null)
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({})

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

      // Connexion au serveur Socket.IO avec URL dynamique
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '')
      socketRef.current = socket

      socket.emit('broadcaster')

      socket.on('watcher', (id: string) => {
        const peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
          ]
        })

        peerConnections.current[id] = peerConnection

        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream)
        })

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('candidate', id, event.candidate)
          }
        }

        peerConnection.createOffer()
          .then(sdp => peerConnection.setLocalDescription(sdp))
          .then(() => {
            socket.emit('offer', id, peerConnection.localDescription)
          })
      })

      socket.on('answer', (id: string, description: RTCSessionDescription) => {
        peerConnections.current[id].setRemoteDescription(description)
      })

      socket.on('candidate', (id: string, candidate: RTCIceCandidate) => {
        peerConnections.current[id].addIceCandidate(new RTCIceCandidate(candidate))
      })

      socket.on('disconnectPeer', (id: string) => {
        peerConnections.current[id].close()
        delete peerConnections.current[id]
      })

      socket.on('viewerCount', (count: number) => {
        setViewers(count)
      })

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

    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
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