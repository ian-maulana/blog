import { IUser } from '../../domain/user_model';

export interface OnboardRepo {
  createPassword(token: string, password: string): Promise<IUser | null>;
}
