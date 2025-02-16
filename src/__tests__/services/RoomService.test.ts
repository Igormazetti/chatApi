import { RoomService } from '../../services/RoomService';
import { RoomModel } from '../../models/RoomModel';
import { UserModel } from '../../models/UserModel';
import { User } from '../../@types/User';

const mockCompleteUser: User = {
  id: 1,
  username: 'testUser',
  password: 'hashedPassword',
  created_at: new Date(),
};

const mockCompleteUser2: User = {
  id: 2,
  username: 'testUser2',
  password: 'hashedPassword',
  created_at: new Date(),
};

const mockRoomModel = {
  createRoom: jest.fn(),
  addMember: jest.fn(),
  removeMember: jest.fn(),
  getRoomMembers: jest.fn(),
  findRoomById: jest.fn(),
  isUserMember: jest.fn(),
} as unknown as jest.Mocked<RoomModel>;

const mockUserModel = {
  findUserById: jest.fn(),
  findUserByUsername: jest.fn(),
  createUser: jest.fn(),
} as unknown as jest.Mocked<UserModel>;

describe('RoomService', () => {
  let roomService: RoomService;

  beforeEach(() => {
    jest.clearAllMocks();
    roomService = new RoomService(mockRoomModel, mockUserModel);
  });

  describe('createRoom', () => {
    it('should create a room successfully', async () => {
      const mockRoom = { id: 1, name: 'Test Room', created_at: new Date() };
      const mockRoomMember = { room_id: 1, user_id: 1, created_at: new Date() };

      mockUserModel.findUserById.mockResolvedValue(mockCompleteUser);
      mockRoomModel.createRoom.mockResolvedValue(mockRoom);
      mockRoomModel.addMember.mockResolvedValue(mockRoomMember);

      const result = await roomService.createRoom('Test Room', 1);

      expect(result.status).toBe(201);
      expect(result.data).toEqual(mockRoom);
      expect(mockUserModel.findUserById).toHaveBeenCalledWith(1);
      expect(mockRoomModel.createRoom).toHaveBeenCalledWith('Test Room');
      expect(mockRoomModel.addMember).toHaveBeenCalledWith(1, 1);
    });

    it('should return error if user not found', async () => {
      mockUserModel.findUserById.mockResolvedValue(null);

      const result = await roomService.createRoom('Test Room', 1);

      expect(result.status).toBe(404);
      expect(result.error).toBe('Creator user not found');
      expect(mockRoomModel.createRoom).not.toHaveBeenCalled();
    });

    it('should return error if room name is empty', async () => {
      const mockUser = {
        id: 1,
        username: 'testUser',
        password: 'hashedpswd',
        created_at: new Date(),
      };
      mockUserModel.findUserById.mockResolvedValue(mockUser);

      const result = await roomService.createRoom('', 1);

      expect(result.status).toBe(400);
      expect(result.error).toBe('Room name cannot be empty');
      expect(mockRoomModel.createRoom).not.toHaveBeenCalled();
    });
  });

  describe('addMember', () => {
    it('should add member successfully', async () => {
      const mockRoom = { id: 1, name: 'Test Room', created_at: new Date() };
      mockUserModel.findUserById.mockResolvedValue(mockCompleteUser2);
      const mockRoomMember = { room_id: 1, user_id: 2, created_at: new Date() };

      mockRoomModel.findRoomById.mockResolvedValue(mockRoom);
      mockRoomModel.isUserMember.mockResolvedValue(false);
      mockRoomModel.addMember.mockResolvedValue(mockRoomMember);

      const result = await roomService.addMember(1, 2);

      expect(result.status).toBe(201);
      expect(result.data).toEqual(mockRoomMember);
      expect(mockRoomModel.findRoomById).toHaveBeenCalledWith(1);
      expect(mockUserModel.findUserById).toHaveBeenCalledWith(2);
      expect(mockRoomModel.isUserMember).toHaveBeenCalledWith(1, 2);
      expect(mockRoomModel.addMember).toHaveBeenCalledWith(1, 2);
    });

    it('should return error if user is already a member', async () => {
      const mockRoom = { id: 1, name: 'Test Room', created_at: new Date() };
      const mockUser = {
        id: 2,
        username: 'testUser2',
        password: 'hashedPassword',
        created_at: new Date(),
      };

      mockRoomModel.findRoomById.mockResolvedValue(mockRoom);
      mockUserModel.findUserById.mockResolvedValue(mockUser);
      mockRoomModel.isUserMember.mockResolvedValue(true);

      const result = await roomService.addMember(1, 2);

      expect(result.status).toBe(400);
      expect(result.error).toBe('User is already a member of this room');
      expect(mockRoomModel.addMember).not.toHaveBeenCalled();
    });

    it('should return error if room not found', async () => {
      mockRoomModel.findRoomById.mockResolvedValue(undefined);

      const result = await roomService.addMember(1, 2);

      expect(result.status).toBe(404);
      expect(result.error).toBe('Room not found');
      expect(mockUserModel.findUserById).not.toHaveBeenCalled();
      expect(mockRoomModel.isUserMember).not.toHaveBeenCalled();
      expect(mockRoomModel.addMember).not.toHaveBeenCalled();
    });

    it('should return error if user not found', async () => {
      const mockRoom = { id: 1, name: 'Test Room', created_at: new Date() };

      mockRoomModel.findRoomById.mockResolvedValue(mockRoom);
      mockUserModel.findUserById.mockResolvedValue(null);

      const result = await roomService.addMember(1, 2);

      expect(result.status).toBe(404);
      expect(result.error).toBe('User not found');
      expect(mockRoomModel.isUserMember).not.toHaveBeenCalled();
      expect(mockRoomModel.addMember).not.toHaveBeenCalled();
    });

    it('should return error if adding member fails', async () => {
      const mockRoom = { id: 1, name: 'Test Room', created_at: new Date() };
      const mockUser = {
        id: 2,
        username: 'testUser2',
        password: 'hashedPassword',
        created_at: new Date(),
      };

      mockRoomModel.findRoomById.mockResolvedValue(mockRoom);
      mockUserModel.findUserById.mockResolvedValue(mockUser);
      mockRoomModel.isUserMember.mockResolvedValue(false);
      mockRoomModel.addMember.mockRejectedValue(new Error('Database error'));

      const result = await roomService.addMember(1, 2);

      expect(result.status).toBe(500);
      expect(result.error).toBe('Failed to add member to room');
    });
  });
});
