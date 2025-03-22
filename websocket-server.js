const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3001 });

const clients = new Map();

server.on('connection', (ws) => {
  console.log('Nouveau client connecté');
  const clientId = Math.random().toString(36).substring(7);
  clients.set(clientId, ws);

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    switch (data.type) {
      case 'broadcaster':
        broadcastToAll(ws, { type: 'broadcaster' });
        break;
      case 'watcher':
        broadcastToAll(ws, { type: 'watcher', id: clientId });
        break;
      case 'offer':
        sendToClient(data.targetId, { type: 'offer', id: clientId, data: data.offer });
        break;
      case 'answer':
        sendToClient(data.targetId, { type: 'answer', id: clientId, data: data.answer });
        break;
      case 'candidate':
        sendToClient(data.targetId, { type: 'candidate', id: clientId, data: data.candidate });
        break;
    }
  });

  ws.on('close', () => {
    clients.delete(clientId);
    broadcastToAll(ws, { type: 'disconnect', id: clientId });
  });
});

function broadcastToAll(sender, message) {
  clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function sendToClient(targetId, message) {
  const client = clients.get(targetId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(message));
  }
}

console.log('Serveur WebSocket démarré sur le port 3001'); 