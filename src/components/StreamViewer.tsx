'use client';

import { useEffect, useRef, useState } from 'react';

export default function StreamViewer() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

  useEffect(() => {
    const connectToStream = () => {
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('Connecté au serveur WebSocket');
          setIsConnected(true);
          setError(null);
          ws.send(JSON.stringify({ type: 'viewer' }));
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case 'offer':
              handleOffer(data.offer);
              break;
            case 'candidate':
              handleCandidate(data.candidate);
              break;
          }
        };

        ws.onclose = () => {
          console.log('Déconnecté du serveur WebSocket');
          setIsConnected(false);
        };

        ws.onerror = (error) => {
          console.error('Erreur WebSocket:', error);
          setError('Erreur de connexion au serveur');
          setIsConnected(false);
        };

      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        setError('Erreur lors de la connexion au stream');
      }
    };

    connectToStream();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    try {
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      });

      peerConnectionRef.current = peerConnection;

      peerConnection.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate && wsRef.current) {
          wsRef.current.send(JSON.stringify({
            type: 'candidate',
            candidate: event.candidate
          }));
        }
      };

      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({
          type: 'answer',
          answer: answer
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la gestion de l\'offre:', error);
      setError('Erreur lors de la connexion avec le diffuseur');
    }
  };

  const handleCandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du candidat ICE:', error);
    }
  };

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
                <p className="text-white mb-4">Connexion au stream...</p>
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