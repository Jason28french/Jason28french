import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';

export const initSocket = (server: NetServer) => {
  const io = new SocketIOServer(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Nouveau client connecté');

    socket.on('broadcaster', () => {
      socket.broadcast.emit('broadcaster');
    });

    socket.on('watcher', () => {
      socket.to('broadcaster').emit('watcher', socket.id);
    });

    socket.on('offer', (id, message) => {
      socket.to(id).emit('offer', socket.id, message);
    });

    socket.on('answer', (id, message) => {
      socket.to(id).emit('answer', socket.id, message);
    });

    socket.on('candidate', (id, message) => {
      socket.to(id).emit('candidate', socket.id, message);
    });

    socket.on('disconnect', () => {
      socket.to('broadcaster').emit('disconnectPeer', socket.id);
    });
  });

  return io;
}; 