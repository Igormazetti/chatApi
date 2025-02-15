import { Request, Response } from 'express';
import { ChatService } from '../services/ChatService';
import { getIO } from '../config/socketIo';
import { SocketEvents } from '../constants/socketEvents';

export class ChatController {
  constructor(private chatService: ChatService) {}

  async sendMessage(req: Request, res: Response): Promise<void> {
    const { text, receiverId, roomId, token } = req.body;
    
    const response = await this.chatService.sendMessage({
      senderId: Number(token),
      receiverId: Number(receiverId),
      text,
      roomId: Number(roomId)
    });

    if (response.error) {
      res.status(response.status).json({ error: response.error });
    } else {
      getIO().to(String(roomId)).emit(SocketEvents.MESSAGE.SENT, response.data);
      res.status(response.status).json(response.data);
    }
  }

  async editMessage(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { text, token } = req.body;

    const response = await this.chatService.editMessage({
      id: Number(id),
      userId: Number(token),
      text
    });

    if (response.error) {
      res.status(response.status).json({ error: response.error });
    } else {
      getIO().to(String(response.data?.room_id)).emit('messageEdited', response.data);
      res.status(response.status).json(response.data);
    }
  }

  async deleteMessage(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { token } = req.body;

    const response = await this.chatService.deleteMessage({
      id: Number(id),
      userId: Number(token)
    });

    if (response.error) {
      res.status(response.status).json({ error: response.error });
    } else {
      getIO().to(token).emit('messageDeleted', response.data);
      res.status(response.status).send();
    }
  }

  async replyToMessage(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { text, token } = req.body;

    const response = await this.chatService.replyToMessage({
      id: Number(id),
      senderId: Number(token),
      text
    });

    if (response.error) {
      res.status(response.status).json({ error: response.error });
    } else {
      getIO().to(String(response.data?.room_id)).emit('messageReplied', response.data);
      res.status(response.status).json(response.data);
    }
  }
} 