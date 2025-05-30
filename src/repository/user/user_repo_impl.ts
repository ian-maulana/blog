import crypto from 'crypto';
import { IUser, UserModel } from '../../domain/user_model';
import { UserRepo } from './user_repo';

class UserRepoImpl implements UserRepo {
  async getPasswordToken(id: string): Promise<string | undefined> {
    const docs = await UserModel.findOne({ _id: id }).exec();

    if (docs) {
      const token = crypto.randomBytes(20).toString('hex');
      docs.passwordTokenExpired = new Date(Date.now() + 10 * 60 * 1000);
      docs.passwordToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      await docs.save();

      return token;
    }
  }

  async findById(id: string): Promise<IUser | null> {
    const docs = await UserModel.findById(id).exec();
    if (!docs) return null;

    const user: IUser = {
      id: docs.id,
      email: docs.email,
      name: docs.name,
      status: docs.status,
      role: docs.role,
    };

    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const docs = await UserModel.findOne({ email }).exec();
    if (!docs) return null;

    const user: IUser = {
      id: docs.id,
      email: docs.email,
      name: docs.name,
      status: docs.status,
      role: docs.role,
    };

    return user;
  }

  async update(user: IUser): Promise<IUser | null> {
    const docs = await UserModel.findOne({ _id: user.id }).exec();

    if (docs) {
      docs.name = user.name;
      docs.status = user.status;
      docs.role = user.role;
      if (user.password) {
        docs.password = user.password;
      }

      await docs.save();
    }

    return docs;
  }

  async delete(id: string): Promise<IUser | null> {
    const doc = await UserModel.findByIdAndDelete(id).exec();

    return doc;
  }

  async create(user: IUser) {
    const docs = new UserModel({
      name: user.name,
      email: user.email,
      password: user.password,
      status: user.status,
      role: user.role,
    });

    const result = await docs.save();
    return result;
  }

  async findAll(): Promise<IUser[]> {
    const users = await UserModel.find().exec();
    return users.map(user => {
      const docs: IUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
        role: user.role,
      };

      return docs;
    });
  }
}

export default UserRepoImpl;
