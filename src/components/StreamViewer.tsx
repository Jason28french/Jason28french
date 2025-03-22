'use client';

import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export default function StreamViewer() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const connectToStream = () => {
      try {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '');
        socketRef.current = socket;

        socket.emit('watcher');

        socket.on('broadcaster', () => {
          console.log('Diffuseur trouvé');
        });

        socket.on('offer', (id: string, description: RTCSessionDescription) => {
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
            if (event.candidate) {
              socket.emit('candidate', id, event.candidate);
            }
          };

          peerConnection.setRemoteDescription(description)
            .then(() => peerConnection.createAnswer())
            .then(sdp => peerConnection.setLocalDescription(sdp))
            .then(() => {
              socket.emit('answer', id, peerConnection.localDescription);
            });
        });

        socket.on('candidate', (id: string, candidate: RTCIceCandidate) => {
          if (peerConnectionRef.current) {
            peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

        socket.on('connect', () => {
          setIsConnected(true);
          setError(null);
        });

        socket.on('disconnect', () => {
          setIsConnected(false);
        });

        socket.on('error', (err: Error) => {
          console.error('Erreur Socket.IO:', err);
          setError('Erreur de connexion au stream');
        });

      } catch (err) {
        console.error('Erreur de connexion:', err);
        setError('Impossible de se connecter au stream');
      }
    };

    connectToStream();

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