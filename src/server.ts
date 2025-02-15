import express from 'express';
import { createServer } from 'http';
import { json } from 'body-parser';
import { chatRouter } from './routes/chatRoutes';
import { userRouter } from './routes/userRoutes';
import { authRouter } from './routes/authRoutes';
import { roomRouter } from './routes/roomRoutes';
import 'dotenv/config';
import { initializeSocket } from './config/socketIo';

const app = express();
export const httpServer = createServer(app);

initializeSocket(httpServer);

const PORT = process.env.PORT || 3000;

app.use(json());

app.use('/api/chat', chatRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/rooms', roomRouter);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 