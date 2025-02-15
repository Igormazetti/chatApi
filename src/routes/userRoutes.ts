import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserModel } from '../models/UserModel';
import { db } from '../config/database';
import { userServiceFactory } from '../services/factories/userServiceFactory';

const userModel = new UserModel(db);
const userService = userServiceFactory(userModel);
const userController = new UserController(userService);

export const userRouter = Router();

userRouter.post('/create', (req, res) => userController.createUser(req, res));
userRouter.get('/:id', (req, res) => userController.getUser(req, res)); 