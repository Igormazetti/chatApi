import { Pool } from 'pg';

export interface Room {
  id: number;
  name: string;
  created_at: Date;
}

export interface RoomMember {
  room_id: number;
  user_id: number;
  created_at: Date;
}

export class RoomModel {
  constructor(private db: Pool) {}

  async createRoom(name: string): Promise<Room> {
    const result = await this.db.query(
      'INSERT INTO rooms (name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0];
  }

  async addMember(roomId: number, userId: number): Promise<RoomMember> {
    const result = await this.db.query(
      'INSERT INTO rooms_members (room_id, user_id) VALUES ($1, $2) RETURNING *',
      [roomId, userId]
    );
    return result.rows[0];
  }

  async removeMember(roomId: number, userId: number): Promise<boolean> {
    const result = await this.db.query(
      'DELETE FROM rooms_members WHERE room_id = $1 AND user_id = $2',
      [roomId, userId]
    );

    return result.rowCount !== null && result.rowCount > 0;
  }

  async getRoomMembers(roomId: number): Promise<number[]> {
    const result = await this.db.query(
      'SELECT user_id FROM rooms_members WHERE room_id = $1',
      [roomId]
    );
    return result.rows.map(row => row.user_id);
  }

  async findRoomById(id: number): Promise<Room | undefined> {
    const result = await this.db.query('SELECT * FROM rooms WHERE id = $1', [id]);
    return result.rows[0];
  }

  async isUserMember(roomId: number, userId: number): Promise<boolean> {
    const result = await this.db.query(
      'SELECT 1 FROM rooms_members WHERE room_id = $1 AND user_id = $2',
      [roomId, userId]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }
} 