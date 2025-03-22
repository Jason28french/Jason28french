import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Stockage des connexions actives
const activeConnections = new Map();

io.on('connection', (socket) => {
  console.log('Nouveau client connecté:', socket.id);

  // Gestion des spectateurs
  socket.on('join-stream', () => {
    socket.join('stream-room');
    io.to('stream-room').emit('viewer-count', io.sockets.adapter.rooms.get('stream-room')?.size || 0);
  });

  // Gestion du broadcaster
  socket.on('broadcaster', () => {
    socket.join('broadcaster');
    socket.broadcast.emit('broadcaster');
  });

  // Gestion des offres WebRTC
  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });

  // Gestion des réponses WebRTC
  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  // Gestion des candidats ICE
  socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate);
  });

  // Gestion de la déconnexion
  socket.on('disconnect', () => {
    if (socket.rooms.has('broadcaster')) {
      io.emit('broadcaster-disconnected');
    }
    io.to('stream-room').emit('viewer-count', io.sockets.adapter.rooms.get('stream-room')?.size || 0);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Serveur de streaming démarré sur le port ${PORT}`);
}); 