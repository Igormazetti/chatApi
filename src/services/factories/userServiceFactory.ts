import { UserService } from '../UserService';
import { UserModel } from '../../models/UserModel';

export const userServiceFactory = (userModel: UserModel) => {
  return new UserService(userModel);
};