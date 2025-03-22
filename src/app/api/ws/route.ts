import { WebSocketServer } from 'ws';
import { NextResponse } from 'next/server';

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
  console.log('Nouveau client connecté');

  ws.on('message', (message) => {
    const data = JSON.parse(message.toString());
    
    switch (data.type) {
      case 'broadcaster':
        broadcastToAll(ws, { type: 'broadcaster' });
        break;
      case 'watcher':
        broadcastToAll(ws, { type: 'watcher', id: ws.id });
        break;
      case 'offer':
        sendToClient(data.targetId, { type: 'offer', id: ws.id, data: data.offer });
        break;
      case 'answer':
        sendToClient(data.targetId, { type: 'answer', id: ws.id, data: data.answer });
        break;
      case 'candidate':
        sendToClient(data.targetId, { type: 'candidate', id: ws.id, data: data.candidate });
        break;
    }
  });

  ws.on('close', () => {
    broadcastToAll(ws, { type: 'disconnect', id: ws.id });
  });
});

function broadcastToAll(sender: any, message: any) {
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function sendToClient(targetId: string, message: any) {
  wss.clients.forEach((client) => {
    if (client.id === targetId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

export async function GET(req: Request) {
  const { socket, response } = Deno.upgradeWebSocket(req);
  wss.handleUpgrade(req, socket, Buffer.alloc(0), (ws) => {
    wss.emit('connection', ws);
  });
  return response;
} 