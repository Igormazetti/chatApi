import { UserModel } from '../models/UserModel';
import Encrypt from '../utils/hash';
import Token from '../utils/jwt';
import { AuthResponse } from '../@types/AuthResponse';

interface ServiceResponse<T> {
  status: number;
  data?: T;
  error?: string;
}

export class AuthService {
  private encrypt: Encrypt; 
  private token: Token;

  constructor(private userModel: UserModel) {
    this.encrypt = new Encrypt();
    this.token = new Token();
  }

  async login(username: string, password: string): Promise<ServiceResponse<AuthResponse>> {
    try {
      const user = await this.userModel.findUserByUsername(username);

      if (!user) {
        return {
          status: 404,
          error: 'Usuário não encontrado!'
        };
      }

      const token = this.token.createToken(String(user.id));
     
      return {
        status: 200,
        data: {
          token,
          user: {
            id: user.id,
            username: user.username
          }
        }
      };
    } catch (error) {
      return {
        status: 500,
        error: 'Failed to login'
      };
    }
  }
} 