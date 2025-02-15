import { Server } from "socket.io";
import { Server as HttpServer } from 'http';

const socketConfig = {
  cors: { 
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'] 
  },
  pingTimeout: 60000,
  pingInterval: 25000,
};

let io: Server;

export function initializeSocket(httpServer: HttpServer) {
  io = new Server(httpServer, socketConfig);

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('leaveRoom', (roomId: string) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}
