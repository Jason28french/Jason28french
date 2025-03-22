import { Server } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';

const ioHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

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
  }

  res.end();
};

export default ioHandler; 