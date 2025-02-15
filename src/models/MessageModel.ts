import { Pool } from 'pg';
import { Message } from '../@types/Message';

export class MessageModel {
  constructor(private db: Pool) {}

  async createMessage(
    senderId: number, 
    text: string, 
    roomId: number,
    receiverId?: number, 
    replyTo?: number
  ): Promise<Message> {
    const result = await this.db.query(
      `INSERT INTO messages 
        (sender_id, receiver_id, room_id, text, reply_to) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [senderId, receiverId, roomId, text, replyTo]
    );
    return result.rows[0];
  }

  async findMessageById(id: number): Promise<Message | undefined> {
    const result = await this.db.query('SELECT * FROM messages WHERE id = $1', [id]);
    return result.rows[0];
  }

  async getRoomMessages(roomId: number): Promise<Message[]> {
    const result = await this.db.query(
      'SELECT * FROM messages WHERE room_id = $1 ORDER BY created_at ASC',
      [roomId]
    );
    return result.rows;
  }

  async updateMessage(id: number, text: string): Promise<Message | undefined> {
    const result = await this.db.query(
      'UPDATE messages SET text = $1 WHERE id = $2 RETURNING *',
      [text, id]
    );
    return result.rows[0];
  }

  async deleteMessage(id: number): Promise<boolean> {
    const result = await this.db.query(
      'DELETE FROM messages WHERE id = $1 RETURNING id', 
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }
} 