import { Request, Response } from 'express';
import { ChatService } from '../services/ChatService';

export class ChatController {
  constructor(private chatService: ChatService) {}

  async sendMessage(req: Request, res: Response): Promise<void> {
    const { receiverId, text, replyTo, roomId } = req.body;
    const senderId = req.body.token;

    const response = await this.chatService.sendMessage({senderId: parseInt(senderId), receiverId, text, replyTo, roomId});
    if (response.error) {
      res.status(response.status).json({ error: response.error });
    } else {
      res.status(response.status).json(response.data);
    }
  }

  async editMessage(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { text, token, roomId } = req.body;
    const userId = token;
    const response = await this.chatService.editMessage({id: parseInt(id), userId, text});
    if (response.error) {
      res.status(response.status).json({ error: response.error });
    } else {
      res.status(response.status).json(response.data);
    }
  }

  async deleteMessage(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { token, roomId } = req.body;
    const userId = token;

    const response = await this.chatService.deleteMessage({id: parseInt(id), userId: parseInt(userId)});
    if (response.error) {
      res.status(response.status).json({ error: response.error });
    } else {
      res.status(response.status).send();
    }
  }

  async replyToMessage(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { text, token, roomId } = req.body;
    const senderId = token;

    const response = await this.chatService.replyToMessage({id: parseInt(id), senderId: parseInt(senderId), text});
    if (response.error) {
      res.status(response.status).json({ error: response.error });
    } else {
      res.status(response.status).json(response.data);
    }
  }
} 