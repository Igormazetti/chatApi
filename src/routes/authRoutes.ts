import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserModel } from '../models/UserModel';
import { db } from '../config/database';
import { authServiceFactory } from '../services/factories/authServiceFactory';

const userModel = new UserModel(db);
const authService = authServiceFactory(userModel);
const authController = new AuthController(authService);

export const authRouter = Router();

authRouter.post('/login', (req, res) => authController.login(req, res));