import { compare } from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { sign } from 'jsonwebtoken';

import { IUser, UserModel } from '@domain/user_model';

import { JWT_EXPIRE, JWT_SECRET } from '@utils/environment';

import OnboardRepo from '@repository/onboard/onboard_repo';

class OnboardRepoImpl implements OnboardRepo {
  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<IUser | null> {
    const doc = await UserModel.findOne({
      _id: userId,
    }).select('+password');

    if (currentPassword && doc?.password) {
      const isMatch = await compare(currentPassword, doc.password);

      if (isMatch) {
        doc.password = newPassword;
        doc.save();

        return doc;
      }
    }

    return null;
  }

  async getSignedJwtToken(userId: string): Promise<string> {
    return sign({ id: userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
    });
  }

  async verifyUser(user: Partial<IUser>): Promise<IUser | null> {
    const doc = await UserModel.findOne({ email: user.email })
      .select('+password')
      .lean();

    if (user.password && doc?.password) {
      const isMatch = await compare(user.password, doc.password);

      if (isMatch) {
        const { _id, __v, password, ...rest } = doc;
        return { ...rest, id: _id.toString() };
      }
    }

    return null;
  }

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
