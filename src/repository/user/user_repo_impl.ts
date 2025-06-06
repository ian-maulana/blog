import { IUser, UserModel } from '@domain/user_model';

import { transformObjectId } from '@utils/mongo_helper';

import UserRepo from '@repository/user/user_repo';

class UserRepoImpl implements UserRepo {
  async findOne(user: Partial<IUser>): Promise<IUser | null> {
    const doc = await UserModel.findOne(transformObjectId(user)).lean();
    return doc;
  }

  async update(user: IUser): Promise<IUser | null> {
    const { id } = user;
    const doc = await UserModel.findOne(transformObjectId({ id })).exec();

    if (doc) {
      doc.email = user.email;
      doc.name = user.name;
      doc.status = user.status;
      doc.role = user.role;

      if (user.password) {
        doc.password = user.password;
      }

      if (user.passwordToken) {
        doc.passwordToken = user.passwordToken;
      }

      if (user.passwordTokenExpired) {
        doc.passwordTokenExpired = user.passwordTokenExpired;
      }

      await doc.save();
    }

    return doc;
  }

  async delete(id: string): Promise<IUser | null> {
    const doc = await UserModel.findByIdAndDelete(id).lean();
    return doc;
  }

  async create(user: IUser) {
    const doc = new UserModel({
      name: user.name,
      email: user.email,
      password: user.password,
      status: user.status,
      role: user.role,
    });

    const result = await doc.save();
    return result;
  }

  async find(): Promise<IUser[]> {
    const docs = await UserModel.find().exec();
    return docs;
  }
}

export default UserRepoImpl;
