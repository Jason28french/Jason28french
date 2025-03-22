'use client';

import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const STREAMING_SERVER = process.env.NEXT_PUBLIC_STREAMING_SERVER || 'http://localhost:3001';

export default function StreamViewer() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    // Connexion au serveur Socket.IO
    socketRef.current = io(STREAMING_SERVER);

    // Configuration de la connexion Socket.IO
    socketRef.current.on('connect', () => {
      console.log('Connecté au serveur de streaming');
      setIsConnected(true);
      socketRef.current.emit('join-stream');
    });

    socketRef.current.on('broadcaster', async () => {
      try {
        // Création de la connexion WebRTC
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
          ]
        });

        pc.ontrack = (event) => {
          if (videoRef.current) {
            videoRef.current.srcObject = event.streams[0];
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate && socketRef.current) {
            socketRef.current.emit('ice-candidate', event.candidate);
          }
        };

        // Création de l'offre
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // Envoi de l'offre au broadcaster
        socketRef.current.emit('offer', offer);

        peerConnectionRef.current = pc;
      } catch (err) {
        console.error('Erreur lors de la création de la connexion WebRTC:', err);
        setError('Erreur lors de la connexion au stream');
      }
    });

    socketRef.current.on('answer', async (answer: RTCSessionDescriptionInit) => {
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } catch (err) {
        console.error('Erreur lors de la réception de la réponse:', err);
        setError('Erreur lors de la connexion au stream');
      }
    });

    socketRef.current.on('ice-candidate', async (candidate: RTCIceCandidateInit) => {
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error('Erreur lors de l\'ajout du candidat ICE:', err);
      }
    });

    socketRef.current.on('broadcaster-disconnected', () => {
      setIsConnected(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white mb-4">En attente du stream...</p>
                {error && (
                  <p className="text-red-500 mb-4">{error}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 