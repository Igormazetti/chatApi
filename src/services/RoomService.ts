import { RoomModel, Room, RoomMember } from '../models/RoomModel';
import { UserModel } from '../models/UserModel';

interface ServiceResponse<T> {
  status: number;
  data?: T;
  error?: string;
}

export class RoomService {
  constructor(private roomModel: RoomModel, private userModel: UserModel) {}

  async createRoom(name: string, creatorId: number): Promise<ServiceResponse<Room>> {
    try {
      const creator = await this.userModel.findUserById(creatorId);
      if (!creator) {
        return { status: 404, error: 'Creator user not found' };
      }

      if (!name?.trim()) {
        return { status: 400, error: 'Room name cannot be empty' };
      }

      const room = await this.roomModel.createRoom(name);
      await this.roomModel.addMember(room.id, creatorId);

      return { status: 201, data: room };
    } catch (error) {
      return { status: 500, error: 'Failed to create room' };
    }
  }

  async addMember(roomId: number, userId: number): Promise<ServiceResponse<RoomMember>> {
    try {
      const [room, user] = await Promise.all([
        this.roomModel.findRoomById(roomId),
        this.userModel.findUserById(userId)
      ]);

      if (!room) {
        return { status: 404, error: 'Room not found' };
      }

      if (!user) {
        return { status: 404, error: 'User not found' };
      }

      const isMember = await this.roomModel.isUserMember(roomId, userId);
      if (isMember) {
        return { status: 400, error: 'User is already a member of this room' };
      }

      const member = await this.roomModel.addMember(roomId, userId);
      return { status: 201, data: member };
    } catch (error) {
      return { status: 500, error: 'Failed to add member to room' };
    }
  }

  async removeMember(roomId: number, userId: number): Promise<ServiceResponse<null>> {
    try {
      const room = await this.roomModel.findRoomById(roomId);
      if (!room) {
        return { status: 404, error: 'Room not found' };
      }

      const isMember = await this.roomModel.isUserMember(roomId, userId);
      if (!isMember) {
        return { status: 404, error: 'User is not a member of this room' };
      }

      const removed = await this.roomModel.removeMember(roomId, userId);
      return { status: removed ? 204 : 404 };
    } catch (error) {
      return { status: 500, error: 'Failed to remove member from room' };
    }
  }

  async getRoomMembers(roomId: number): Promise<ServiceResponse<number[]>> {
    try {
      const room = await this.roomModel.findRoomById(roomId);
      if (!room) {
        return { status: 404, error: 'Room not found' };
      }

      const members = await this.roomModel.getRoomMembers(roomId);
      return { status: 200, data: members };
    } catch (error) {
      return { status: 500, error: 'Failed to get room members' };
    }
  }
} 