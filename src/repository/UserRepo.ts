import { IUser, UserModel } from '../domain/UserModel';
import { IUserRepo } from './IUserRepo';

class UserRepo implements IUserRepo {
  async findAll(): Promise<IUser[]> {
    const users = await UserModel.find().exec();
    return users.map(user => {
      const dto: IUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
        role: user.role,
      };

      return dto;
    });
  }
}

export default UserRepo;
