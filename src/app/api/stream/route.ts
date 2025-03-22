import { NextResponse } from 'next/server';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws) => {
  console.log('Nouveau client connecté');

  ws.on('message', (message) => {
    // Diffuser le message à tous les clients connectés
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client déconnecté');
  });
});

export async function GET() {
  return NextResponse.json({ status: 'Streaming server running' });
} 