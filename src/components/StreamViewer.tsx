'use client';

import { useEffect, useRef, useState } from 'react';

export default function StreamViewer() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const connectToStream = () => {
      try {
        const ws = new WebSocket('ws://localhost:3001');
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('Connecté au serveur de streaming');
          ws.send(JSON.stringify({ type: 'watcher' }));
          setIsConnected(true);
          setError(null);
        };

        ws.onmessage = async (event) => {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'broadcaster':
              console.log('Diffuseur trouvé');
              break;
            case 'offer':
              await handleOffer(data.id, data.data);
              break;
            case 'candidate':
              await handleCandidate(data.id, data.data);
              break;
            case 'disconnect':
              handleDisconnect(data.id);
              break;
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
        };

        ws.onerror = (err) => {
          console.error('Erreur WebSocket:', err);
          setError('Erreur de connexion au serveur de streaming');
        };

      } catch (err) {
        console.error('Erreur de connexion:', err);
        setError('Impossible de se connecter au stream');
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

  const handleOffer = async (id: string, offer: RTCSessionDescription) => {
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
          targetId: id,
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
        targetId: id,
        answer: answer
      }));
    }
  };

  const handleCandidate = async (id: string, candidate: RTCIceCandidate) => {
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.addIceCandidate(candidate);
    }
  };

  const handleDisconnect = (id: string) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
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