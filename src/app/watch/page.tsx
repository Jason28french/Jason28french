'use client'

import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

const STREAMING_SERVER = process.env.NEXT_PUBLIC_STREAMING_SERVER || 'http://localhost:3001'

export default function WatchPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [broadcasterOnline, setBroadcasterOnline] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const socketRef = useRef<any>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

  useEffect(() => {
    // Connexion au serveur Socket.IO
    socketRef.current = io(STREAMING_SERVER)

    socketRef.current.on('connect', () => {
      console.log('Connecté au serveur de streaming')
      setIsConnected(true)
      socketRef.current.emit('join-stream')
    })

    socketRef.current.on('broadcaster', async () => {
      setBroadcasterOnline(true)
      try {
        // Création de la connexion WebRTC
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
          ]
        })

        pc.ontrack = (event) => {
          if (videoRef.current) {
            videoRef.current.srcObject = event.streams[0]
          }
        }

        pc.onicecandidate = (event) => {
          if (event.candidate && socketRef.current) {
            socketRef.current.emit('ice-candidate', event.candidate)
          }
        }

        // Création et envoi de l'offre
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        socketRef.current.emit('offer', offer)

        peerConnectionRef.current = pc
      } catch (err) {
        console.error('Erreur lors de la création de la connexion WebRTC:', err)
        setError('Erreur lors de la connexion au stream')
      }
    })

    socketRef.current.on('broadcaster-disconnected', () => {
      setBroadcasterOnline(false)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
    })

    socketRef.current.on('disconnect', () => {
      setIsConnected(false)
      setBroadcasterOnline(false)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          Live Stream
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative aspect-video bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {(!isConnected || !broadcasterOnline) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white text-lg mb-4">
                    {!isConnected ? 'Connexion au serveur...' : 
                     !broadcasterOnline ? 'En attente du diffuseur...' : 
                     'Connexion au stream...'}
                  </p>
                  {error && (
                    <p className="text-red-500 mb-4">{error}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  )
} 