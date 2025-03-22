const WebSocket = require('ws');
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

const wss = new WebSocket.Server({ port: port });

let broadcaster = null;
const viewers = new Set();

wss.on('connection', (ws) => {
  console.log('Nouvelle connexion établie');

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'broadcaster':
        broadcaster = ws;
        console.log('Diffuseur connecté');
        break;

      case 'viewer':
        viewers.add(ws);
        console.log('Spectateur connecté');
        if (broadcaster) {
          broadcaster.send(JSON.stringify({
            type: 'viewerCount',
            count: viewers.size
          }));
        }
        break;

      case 'offer':
        if (broadcaster) {
          broadcaster.send(JSON.stringify({
            type: 'offer',
            offer: data.offer
          }));
        }
        break;

      case 'answer':
        viewers.forEach(viewer => {
          viewer.send(JSON.stringify({
            type: 'answer',
            answer: data.answer
          }));
        });
        break;

      case 'candidate':
        if (data.target === 'broadcaster') {
          broadcaster?.send(JSON.stringify({
            type: 'candidate',
            candidate: data.candidate
          }));
        } else {
          viewers.forEach(viewer => {
            viewer.send(JSON.stringify({
              type: 'candidate',
              candidate: data.candidate
            }));
          });
        }
        break;
    }
  });

  ws.on('close', () => {
    if (ws === broadcaster) {
      broadcaster = null;
      console.log('Diffuseur déconnecté');
    } else {
      viewers.delete(ws);
      console.log('Spectateur déconnecté');
      if (broadcaster) {
        broadcaster.send(JSON.stringify({
          type: 'viewerCount',
          count: viewers.size
        }));
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Serveur WebSocket démarré sur le port ${port}`);
}); 