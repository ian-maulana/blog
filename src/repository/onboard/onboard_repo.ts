import { IUser } from '@domain/user_model';

export interface OnboardRepo {
  resetPassword(token: string, password: string): Promise<IUser | null>;
}
