import { Request, Response } from 'express';
import { RoomController } from '../../controllers/RoomController';
import { RoomService } from '../../services/RoomService';

const mockRoomService = {
  createRoom: jest.fn(),
  addMember: jest.fn(),
  removeMember: jest.fn(),
  getRoomMembers: jest.fn(),
} as unknown as jest.Mocked<RoomService>;

describe('RoomController', () => {
  let roomController: RoomController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    roomController = new RoomController(mockRoomService);
  });

  describe('createRoom', () => {
    it('should create room successfully', async () => {
      const mockRoom = { id: 1, name: 'Test Room', created_at: new Date() };
      mockRequest = {
        body: {
          name: 'Test Room',
          token: '1'
        }
      };

      mockRoomService.createRoom.mockResolvedValue({
        status: 201,
        data: mockRoom
      });

      await roomController.createRoom(mockRequest as Request, mockResponse as Response);

      expect(mockRoomService.createRoom).toHaveBeenCalledWith('Test Room', '1');
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockRoom);
    });

    it('should return error if user not authenticated', async () => {
      mockRequest = {
        body: {
          name: 'Test Room',
          token: null
        }
      };

      await roomController.createRoom(mockRequest as Request, mockResponse as Response);

      expect(mockRoomService.createRoom).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'User not authenticated' });
    });
  });

  describe('addMember', () => {
    it('should add member successfully', async () => {
      const mockMember = { room_id: 1, user_id: 2, created_at: new Date() };
      mockRequest = {
        params: { roomId: '1' },
        body: { userId: 2 }
      };

      mockRoomService.addMember.mockResolvedValue({
        status: 201,
        data: mockMember
      });

      await roomController.addMember(mockRequest as Request, mockResponse as Response);

      expect(mockRoomService.addMember).toHaveBeenCalledWith(1, 2);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockMember);
    });
  });

  describe('removeMember', () => {
    it('should remove member successfully', async () => {
      mockRequest = {
        params: { 
          roomId: '1',
          userId: '2'
        }
      };

      mockRoomService.removeMember.mockResolvedValue({
        status: 204
      });

      await roomController.removeMember(mockRequest as Request, mockResponse as Response);

      expect(mockRoomService.removeMember).toHaveBeenCalledWith(1, 2);
      expect(statusMock).toHaveBeenCalledWith(204);
    });
  });

  describe('getRoomMembers', () => {
    it('should get room members successfully', async () => {
      const mockMembers = [1, 2, 3];
      mockRequest = {
        params: { roomId: '1' }
      };

      mockRoomService.getRoomMembers.mockResolvedValue({
        status: 200,
        data: mockMembers
      });

      await roomController.getRoomMembers(mockRequest as Request, mockResponse as Response);

      expect(mockRoomService.getRoomMembers).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockMembers);
    });
  });
}); 