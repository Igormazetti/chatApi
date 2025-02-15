import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const response = await this.authService.login(username, password);
    
    if (response.error) {
      res.status(response.status).json({ error: response.error });
    } else {
      res.status(response.status).json(response.data);
    }
  }
} 