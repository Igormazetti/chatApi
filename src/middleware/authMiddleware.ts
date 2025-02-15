import { Request, Response, NextFunction } from 'express';
import Token from '../utils/jwt';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Bearer token missing' });
    return;
  }

  const token = authHeader.split(' ')[1];

  const tokenInstance = new Token();
  const decoded = tokenInstance.validateToken(token);

  if (!decoded) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  req.body.token = decoded;

  next();
}; 