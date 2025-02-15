import { Request, Response } from 'express';
import { RoomService } from '../services/RoomService';
import { getIO } from '../config/socketIo';
import { SocketEvents } from '../constants/socketEvents';

export class RoomController {
  constructor(private roomService: RoomService) {}

  async createRoom(req: Request, res: Response): Promise<void> {
    const { name, token } = req.body;
    const userId = token;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const result = await this.roomService.createRoom(name, userId);
   
    res.status(result.status).json(result.data || { error: result.error });
  }

  async addMember(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;
    const { userId } = req.body;

    const result = await this.roomService.addMember(Number(roomId), userId);

    if (!result.error) {
      getIO().to(String(roomId)).emit(SocketEvents.ROOM.MEMBER_ADDED, {
        roomId: Number(roomId),
        userId,
        timestamp: new Date()
      });
    }

    res.status(result.status).json(result.data || { error: result.error });
  }

  async removeMember(req: Request, res: Response): Promise<void> {
    const { roomId, userId } = req.params;

    const result = await this.roomService.removeMember(Number(roomId), Number(userId));

    if (!result.error) {
      getIO().to(roomId).emit('memberRemoved', result.data);
    }
  
    res.status(result.status).json(result.data || { error: result.error });
  }

  async getRoomMembers(req: Request, res: Response): Promise<void> {
    const { roomId } = req.params;

    const result = await this.roomService.getRoomMembers(Number(roomId));
    res.status(result.status).json(result.data || { error: result.error });
  }
} 