'use client';

import { useEffect, useRef, useState } from 'react';

export default function StreamViewer() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectToStream = () => {
      try {
        const ws = new WebSocket('ws://localhost:3001');
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('Connecté au stream');
          setIsConnected(true);
          setError(null);
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'frame' && videoRef.current) {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              if (context) {
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);
                videoRef.current!.srcObject = canvas.captureStream();
              }
            };
            img.src = data.data;
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
        };

        ws.onerror = (err) => {
          console.error('Erreur WebSocket:', err);
          setError('Erreur de connexion au stream');
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