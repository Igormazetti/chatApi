import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { authMiddleware } from '../middleware/authMiddleware';
import { chatServiceFactory } from '../services/factories/chatServiceFactory';

const chatService = chatServiceFactory();
const chatController = new ChatController(chatService);

export const chatRouter = Router();

chatRouter.post('/send', authMiddleware, (req, res) => chatController.sendMessage(req, res));
chatRouter.put('/edit/:id', authMiddleware, (req, res) => chatController.editMessage(req, res));
chatRouter.delete('/delete/:id', authMiddleware, (req, res) => chatController.deleteMessage(req, res));
chatRouter.post('/reply/:id', authMiddleware, (req, res) => chatController.replyToMessage(req, res)); 