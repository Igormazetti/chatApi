import { UserModel } from '../models/UserModel';
import Encrypt from '../utils/hash';

interface ServiceResponse<T> {
  status: number;
  data?: T;
  error?: string;
}

export class UserService {
  private encrypt: Encrypt;

  constructor(private userModel: UserModel) {
    this.encrypt = new Encrypt();
  }

  async createUser(
    username: string,
    password: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<ServiceResponse<any>> {
    try {
      const existingUser = await this.userModel.findUserByUsername(username);

      if (existingUser) {
        return {
          status: 422,
          error: 'Username já cadastrado!',
        };
      }

      const hashPassword = this.encrypt.encryptPassword(password);
      const userId = await this.userModel.createUser(username, hashPassword);

      return {
        status: 201,
        data: {
          id: userId,
          username,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        error: 'Failed to create user',
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findUserById(id: number): Promise<ServiceResponse<any>> {
    try {
      const user = await this.userModel.findUserById(id);
      if (user) {
        return { status: 200, data: user };
      } else {
        return { status: 404, error: 'User not found' };
      }
    } catch (error) {
      console.error(error);
      return { status: 500, error: 'Failed to retrieve user' };
    }
  }
}
