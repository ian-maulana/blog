import { IUser, UserModel } from '../../domain/user_model';
import { OnboardRepo } from './onboard_repo';
import crypto from 'crypto';

class OnboardRepoImpl implements OnboardRepo {
  async createPassword(token: string, password: string): Promise<IUser | null> {
    // Get hashed token
    const passwordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await UserModel.findOne({
      passwordToken: passwordToken,
      passwordTokenExpired: { $gt: Date.now() },
    });

    if (user) {
      user.password = password;
      user.passwordToken = undefined;
      user.passwordTokenExpired = undefined;

      await user.save();
    }

    return user;
  }
}

export default OnboardRepoImpl;
