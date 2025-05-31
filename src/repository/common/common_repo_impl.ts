import crypto from 'crypto';

import { UserModel } from '@domain/user_model';

import { CommonRepo } from '@repository/common/common_repo';

class CommonRepoImpl implements CommonRepo {
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
}

export default CommonRepoImpl;
