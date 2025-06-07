import { IUser } from '@domain/user_model';

interface OnboardRepo {
  getSignedJwtToken(userId: string): Promise<string>;
  verifyUser(user: Partial<IUser>): Promise<IUser | null>;
  createPasswordToken(email: string): Promise<string | null>;
  resetPassword(token: string, password: string): Promise<IUser | null>;
  updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<IUser | null>;
}

export default OnboardRepo;
