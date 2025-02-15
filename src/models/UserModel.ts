import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { User, UserCreationResponse } from '../@types/User';

export class UserModel {
  constructor(private db: Pool) {}

  async createUser(username: string, password: string): Promise<number> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await this.db.query<UserCreationResponse>(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
        [username, hashedPassword],
      );

      return result.rows[0].id;
    } catch (error) {
      console.error('Error executing query:', error);
      throw new Error('Failed to create user');
    }
  }

  async findUserById(id: number): Promise<User | null> {
    try {
      const result = await this.db.query<User>(
        'SELECT * FROM users WHERE id = $1',
        [id],
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new Error('Failed to find user');
    }
  }

  async findUserByUsername(username: string): Promise<User | null> {
    try {
      const result = await this.db.query<User>(
        'SELECT * FROM users WHERE username = $1',
        [username],
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw new Error('Failed to find user');
    }
  }
}
