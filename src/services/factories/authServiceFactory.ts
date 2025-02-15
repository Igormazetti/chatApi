import { AuthService } from '../AuthService';
import { UserModel } from '../../models/UserModel';

export const authServiceFactory = (userModel: UserModel) => {
  return new AuthService(userModel);
};