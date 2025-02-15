import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const response = await this.userService.createUser(username, password);

    if (response.error) {
      res.status(response.status).json({ error: response.error });
    } else {
      res.status(response.status).json({ id: response.data });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const response = await this.userService.findUserById(parseInt(id));
    if (response.error) {
      res.status(response.status).json({ error: response.error });
    } else {
      res.status(response.status).json(response.data);
    }
  }
} 