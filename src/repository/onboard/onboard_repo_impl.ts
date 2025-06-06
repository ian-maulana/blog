import { createHash, randomBytes } from 'crypto';

import { IUser, UserModel } from '@domain/user_model';

import OnboardRepo from '@repository/onboard/onboard_repo';

class OnboardRepoImpl implements OnboardRepo {
  async resetPassword(token: string, password: string): Promise<IUser | null> {
    // Get hashed token
    const passwordToken = createHash('sha256').update(token).digest('hex');
    const doc = await UserModel.findOne({
      passwordToken: passwordToken,
      passwordTokenExpired: { $gt: Date.now() },
    });

    if (doc) {
      doc.password = password;
      doc.passwordToken = undefined;
      doc.passwordTokenExpired = undefined;

      await doc.save();
    }

    return doc;
  }

  async createPasswordToken(email: string): Promise<string | null> {
    const doc = await UserModel.findOne({ email });

    if (!doc) {
      return null;
    }

    const token = randomBytes(20).toString('hex');
    doc.passwordTokenExpired = new Date(Date.now() + 10 * 60 * 1000);
    doc.passwordToken = createHash('sha256').update(token).digest('hex');
    await doc.save({ validateBeforeSave: false });

    return token;
  }
}

export default OnboardRepoImpl;
