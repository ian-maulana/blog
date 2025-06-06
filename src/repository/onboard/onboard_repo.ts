import { IUser } from '@domain/user_model';

interface OnboardRepo {
  createPasswordToken(email: string): Promise<string | null>;
  resetPassword(token: string, password: string): Promise<IUser | null>;
}

export default OnboardRepo;
