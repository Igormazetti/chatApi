import { ChatService } from '../../services/ChatService';
import { MessageModel } from '../../models/MessageModel';
import { UserModel } from '../../models/UserModel';
import { RoomModel } from '../../models/RoomModel';
import { Message } from '../../@types/Message';

const mockMessageModel = {
  createMessage: jest.fn(),
  findMessageById: jest.fn(),
  getRoomMessages: jest.fn(),
  updateMessage: jest.fn(),
  deleteMessage: jest.fn(),
} as unknown as jest.Mocked<MessageModel>;

const mockUserModel = {
  findUserById: jest.fn(),
} as unknown as jest.Mocked<UserModel>;

const mockRoomModel = {
  findRoomById: jest.fn(),
  isUserMember: jest.fn(),
} as unknown as jest.Mocked<RoomModel>;

describe('ChatService', () => {
  let chatService: ChatService;

  beforeEach(() => {
    jest.clearAllMocks();
    chatService = new ChatService(mockMessageModel, mockUserModel, mockRoomModel);
  });

  describe('sendMessage', () => {
    const mockSendMessageParams = {
      senderId: 1,
      text: 'Hello World',
      roomId: 1,
      receiverId: 2,
    };

    it('should send message successfully', async () => {
      const mockMessage: Message = {
        id: 1,
        sender_id: 1,
        receiver_id: 2,
        text: 'Hello World',
        room_id: 1,
        created_at: new Date(),
      };

      mockUserModel.findUserById
        .mockResolvedValueOnce({ id: 1, username: 'sender' })
        .mockResolvedValueOnce({ id: 2, username: 'receiver' });
      mockRoomModel.findRoomById.mockResolvedValue({ 
        id: 1, 
        name: 'Test Room',
        created_at: new Date()
      });
      mockRoomModel.isUserMember
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true);
      mockMessageModel.createMessage.mockResolvedValue(mockMessage);

      const result = await chatService.sendMessage(mockSendMessageParams);

      expect(result.status).toBe(201);
      expect(result.data).toEqual(mockMessage);
    });

    it('should return error if message text is empty', async () => {
      const result = await chatService.sendMessage({
        ...mockSendMessageParams,
        text: '',
      });

      expect(result.status).toBe(400);
      expect(result.error).toBe('Message text cannot be empty');
    });

    it('should return error if sender not found', async () => {
      mockUserModel.findUserById.mockResolvedValue(undefined);

      const result = await chatService.sendMessage(mockSendMessageParams);

      expect(result.status).toBe(404);
      expect(result.error).toBe('Sender not found');
    });

    it('should return error if room not found', async () => {
      mockUserModel.findUserById.mockResolvedValue({ id: 1, username: 'sender' });
      mockRoomModel.findRoomById.mockResolvedValue(undefined);

      const result = await chatService.sendMessage(mockSendMessageParams);

      expect(result.status).toBe(404);
      expect(result.error).toBe('Room not found');
    });

    it('should return error if sender is not room member', async () => {
      mockUserModel.findUserById.mockResolvedValue({ id: 1, username: 'sender' });
      mockRoomModel.findRoomById.mockResolvedValue({ 
        id: 1, 
        name: 'Test Room',
        created_at: new Date()
      });
      mockRoomModel.isUserMember.mockResolvedValue(false);

      const result = await chatService.sendMessage(mockSendMessageParams);

      expect(result.status).toBe(403);
      expect(result.error).toBe('User is not a member of this room');
    });
  });

  describe('getRoomMessages', () => {
    it('should get room messages successfully', async () => {
      const mockMessages: Message[] = [
        { 
          id: 1, 
          text: 'Hello', 
          room_id: 1,
          sender_id: 1,
          created_at: new Date()
        },
        { 
          id: 2, 
          text: 'World', 
          room_id: 1,
          sender_id: 2,
          created_at: new Date()
        },
      ];

      mockRoomModel.isUserMember.mockResolvedValue(true);
      mockMessageModel.getRoomMessages.mockResolvedValue(mockMessages);

      const result = await chatService.getRoomMessages({ roomId: 1, userId: 1 });

      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockMessages);
    });

    it('should return error if user is not room member', async () => {
      mockRoomModel.isUserMember.mockResolvedValue(false);

      const result = await chatService.getRoomMessages({ roomId: 1, userId: 1 });

      expect(result.status).toBe(403);
      expect(result.error).toBe('User is not a member of this room');
    });
  });

  describe('editMessage', () => {
    it('should edit message successfully', async () => {
      const mockMessage: Message = {
        id: 1,
        sender_id: 1,
        text: 'Original text',
        room_id: 1,
        created_at: new Date(),
      };

      const updatedMessage: Message = {
        ...mockMessage,
        text: 'Updated text',
      };

      mockMessageModel.findMessageById.mockResolvedValue(mockMessage);
      mockMessageModel.updateMessage.mockResolvedValue(updatedMessage);

      const result = await chatService.editMessage({
        id: 1,
        userId: 1,
        text: 'Updated text',
      });

      expect(result.status).toBe(200);
      expect(result.data).toEqual(updatedMessage);
    });

    it('should return error if message not found', async () => {
      mockMessageModel.findMessageById.mockResolvedValue(undefined);

      const result = await chatService.editMessage({
        id: 1,
        userId: 1,
        text: 'Updated text',
      });

      expect(result.status).toBe(404);
      expect(result.error).toBe('Message not found');
    });

    it('should return error if user is not message sender', async () => {
      const mockMessage: Message = {
        id: 1,
        sender_id: 2,
        text: 'Original text',
        room_id: 1,
        created_at: new Date(),
      };

      mockMessageModel.findMessageById.mockResolvedValue(mockMessage);

      const result = await chatService.editMessage({
        id: 1,
        userId: 1,
        text: 'Updated text',
      });

      expect(result.status).toBe(403);
      expect(result.error).toBe('User not allowed to edit this message');
    });
  });
}); 