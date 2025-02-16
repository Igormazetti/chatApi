import { MessageModel } from '../models/MessageModel';
import { UserModel } from '../models/UserModel';
import { RoomModel } from '../models/RoomModel';
import { Message } from '../@types/Message';

interface ServiceResponse<T> {
  status: number;
  data?: T;
  error?: string;
}

interface SendMessageParams {
  senderId: number;
  text: string;
  roomId: number;
  receiverId?: number;
  replyTo?: number;
}

interface EditMessageParams {
  id: number;
  userId: number;
  text: string;
}

interface DeleteMessageParams {
  id: number;
  userId: number;
}

interface GetRoomMessagesParams {
  roomId: number;
  userId: number;
}

interface ReplyToMessageParams {
  id: number;
  senderId: number;
  text: string;
}

export class ChatService {
  constructor(
    private messageModel: MessageModel,
    private userModel: UserModel,
    private roomModel: RoomModel,
  ) {}

  async sendMessage(
    params: SendMessageParams,
  ): Promise<ServiceResponse<Message>> {
    try {
      const { senderId, text, roomId, receiverId, replyTo } = params;
      console.log(text);
      if (!text?.trim()) {
        return { status: 400, error: 'Message text cannot be empty' };
      }
      if (text.length > 1000) {
        return { status: 400, error: 'Message text is too long' };
      }

      const sender = await this.userModel.findUserById(senderId);
      if (!sender) {
        return { status: 404, error: 'Sender not found' };
      }

      const room = await this.roomModel.findRoomById(roomId);
      if (!room) {
        return { status: 404, error: 'Room not found' };
      }

      const isMember = await this.roomModel.isUserMember(roomId, senderId);
      if (!isMember) {
        return { status: 403, error: 'User is not a member of this room' };
      }

      if (receiverId) {
        const receiver = await this.userModel.findUserById(receiverId);
        if (!receiver) {
          return { status: 404, error: 'Receiver not found' };
        }
        const receiverIsMember = await this.roomModel.isUserMember(
          roomId,
          receiverId,
        );
        if (!receiverIsMember) {
          return {
            status: 403,
            error: 'Receiver is not a member of this room',
          };
        }
      }

      if (replyTo) {
        const originalMessage =
          await this.messageModel.findMessageById(replyTo);
        if (!originalMessage) {
          return { status: 404, error: 'Original message not found' };
        }
        if (originalMessage.room_id !== roomId) {
          return {
            status: 400,
            error: 'Cannot reply to message from different room',
          };
        }
      }

      const message = await this.messageModel.createMessage(
        senderId,
        text,
        roomId,
        receiverId,
        replyTo,
      );

      return { status: 201, data: message };
    } catch (error) {
      console.error(error);
      return { status: 500, error: 'Failed to send message' };
    }
  }

  async getRoomMessages(
    params: GetRoomMessagesParams,
  ): Promise<ServiceResponse<Message[]>> {
    try {
      const { roomId, userId } = params;
      const isMember = await this.roomModel.isUserMember(roomId, userId);
      if (!isMember) {
        return { status: 403, error: 'User is not a member of this room' };
      }

      const messages = await this.messageModel.getRoomMessages(roomId);
      return { status: 200, data: messages };
    } catch (error) {
      console.error(error);
      return { status: 500, error: 'Failed to get room messages' };
    }
  }

  async editMessage(
    params: EditMessageParams,
  ): Promise<ServiceResponse<Message>> {
    try {
      const { id, userId, text } = params;
      if (!text?.trim()) {
        return { status: 400, error: 'Message text cannot be empty' };
      }
      if (text.length > 1000) {
        return { status: 400, error: 'Message text is too long' };
      }

      const message = await this.messageModel.findMessageById(id);

      if (!message) {
        return { status: 404, error: 'Message not found' };
      }

      if (message.sender_id !== userId) {
        return { status: 403, error: 'User not allowed to edit this message' };
      }

      const updatedMessage = await this.messageModel.updateMessage(id, text);

      if (updatedMessage) {
        return { status: 200, data: updatedMessage };
      }

      return { status: 500, error: 'Failed to update message' };
    } catch (error) {
      console.error(error);
      return { status: 500, error: 'Failed to edit message' };
    }
  }

  async deleteMessage(
    params: DeleteMessageParams,
  ): Promise<ServiceResponse<null>> {
    try {
      const { id, userId } = params;
      const message = await this.messageModel.findMessageById(id);

      if (!message) {
        return { status: 404, error: 'Message not found' };
      }

      if (message.sender_id !== userId) {
        return {
          status: 403,
          error: 'User not allowed to delete this message',
        };
      }

      const success = await this.messageModel.deleteMessage(id);

      return { status: success ? 204 : 404 };
    } catch (error) {
      console.error(error);
      return { status: 500, error: 'Failed to delete message' };
    }
  }

  async replyToMessage(
    params: ReplyToMessageParams,
  ): Promise<ServiceResponse<Message>> {
    try {
      const { id, senderId, text } = params;
      if (!text?.trim()) {
        return { status: 400, error: 'Message text cannot be empty' };
      }
      if (text.length > 1000) {
        return { status: 400, error: 'Message text is too long' };
      }

      const originalMessage = await this.messageModel.findMessageById(id);
      if (!originalMessage) {
        return { status: 404, error: 'Original message not found' };
      }

      const isMember = await this.roomModel.isUserMember(
        originalMessage.room_id,
        senderId,
      );
      if (!isMember) {
        return { status: 403, error: 'User is not a member of this room' };
      }

      const message = await this.messageModel.createMessage(
        senderId,
        text,
        originalMessage.room_id,
        originalMessage.sender_id,
        originalMessage.id,
      );

      return { status: 201, data: message };
    } catch (error) {
      console.error(error);
      return { status: 500, error: 'Failed to reply to message' };
    }
  }
}
