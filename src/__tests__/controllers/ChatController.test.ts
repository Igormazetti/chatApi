import { Request, Response } from 'express';
import { mockIo } from '../mocks/socketIoMock';
import { SocketEvents } from '../../constants/socketEvents';
import { ChatService } from '../../services/ChatService';
import { ChatController } from '../../controllers/ChatController';

jest.mock('../../config/socketIo', () => ({
  getIO: () => mockIo
}));

const mockChatService = {
  sendMessage: jest.fn(),
  getRoomMessages: jest.fn(),
  editMessage: jest.fn(),
  deleteMessage: jest.fn(),
  replyToMessage: jest.fn(),
} as unknown as jest.Mocked<ChatService>;

describe('ChatController', () => {
  let chatController: ChatController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    sendMock = jest.fn();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock, send: sendMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
      send: sendMock,
    };

    chatController = new ChatController(mockChatService);
  });

  describe('sendMessage', () => {
    it('should send message and emit socket event successfully', async () => {
      const mockMessage = {
        id: 1,
        text: 'Hello World',
        sender_id: 1,
        room_id: 1,
        created_at: new Date(),
      };

      mockRequest = {
        body: {
          token: '1',
          receiverId: 2,
          text: 'Hello World',
          roomId: 1,
        },
      };

      mockChatService.sendMessage.mockResolvedValue({
        status: 201,
        data: mockMessage,
      });

      await chatController.sendMessage(mockRequest as Request, mockResponse as Response);

      expect(mockChatService.sendMessage).toHaveBeenCalledWith({
        senderId: 1,
        receiverId: 2,
        text: 'Hello World',
        roomId: 1,
      });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockMessage);
      expect(mockIo.to).toHaveBeenCalledWith('1');
      expect(mockIo.emit).toHaveBeenCalledWith(SocketEvents.MESSAGE.SENT, mockMessage);
    });

    it('should handle error response', async () => {
      mockRequest = {
        body: {
          token: '1',
          receiverId: 2,
          text: '',
          roomId: 1,
        },
      };

      mockChatService.sendMessage.mockResolvedValue({
        status: 400,
        error: 'Message text cannot be empty',
      });

      await chatController.sendMessage(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Message text cannot be empty' });
    });
  });

  describe('editMessage', () => {
    it('should edit message successfully', async () => {
      const mockMessage = {
        id: 1,
        text: 'Updated text',
        sender_id: 1,
        room_id: 1,
        created_at: new Date(),
      };

      mockRequest = {
        params: { id: '1' },
        body: {
          token: '1',
          text: 'Updated text',
          roomId: 1,
        },
      };

      mockChatService.editMessage.mockResolvedValue({
        status: 200,
        data: mockMessage,
      });

      await chatController.editMessage(mockRequest as Request, mockResponse as Response);

      expect(mockChatService.editMessage).toHaveBeenCalledWith({
        id: 1,
        userId: Number(mockRequest.body.token),
        text: 'Updated text',
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockMessage);
    });
  });

  describe('deleteMessage', () => {
    it('should delete message successfully', async () => {
      mockRequest = {
        params: { id: '1' },
        body: {
          token: '1',
          roomId: 1,
        },
      };

      mockChatService.deleteMessage.mockResolvedValue({
        status: 204,
      });

      await chatController.deleteMessage(mockRequest as Request, mockResponse as Response);

      expect(mockChatService.deleteMessage).toHaveBeenCalledWith({
        id: 1,
        userId: 1,
      });
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalled();
    });
  });

  describe('replyToMessage', () => {
    it('should reply to message successfully', async () => {
      const mockMessage = {
        id: 2,
        text: 'Reply text',
        sender_id: 1,
        room_id: 1,
        reply_to: 1,
        created_at: new Date(),
      };

      mockRequest = {
        params: { id: '1' },
        body: {
          token: '1',
          text: 'Reply text',
        },
      };

      mockChatService.replyToMessage.mockResolvedValue({
        status: 201,
        data: mockMessage,
      });

      await chatController.replyToMessage(mockRequest as Request, mockResponse as Response);

      expect(mockChatService.replyToMessage).toHaveBeenCalledWith({
        id: 1,
        senderId: 1,
        text: 'Reply text',
      });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockMessage);
    });
  });
}); 