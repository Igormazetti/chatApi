import { Router } from 'express';
import { RoomController } from '../controllers/RoomController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roomServiceFactory } from '../services/factories/roomServiceFactory';

const roomService = roomServiceFactory();
const roomController = new RoomController(roomService);

export const roomRouter = Router();

roomRouter.post('/create', authMiddleware, (req, res) => roomController.createRoom(req, res));
roomRouter.post('/:roomId/members', authMiddleware, (req, res) => roomController.addMember(req, res));
roomRouter.delete('/:roomId/members/:userId', authMiddleware, (req, res) => roomController.removeMember(req, res));
roomRouter.get('/:roomId/members', authMiddleware, (req, res) => roomController.getRoomMembers(req, res));