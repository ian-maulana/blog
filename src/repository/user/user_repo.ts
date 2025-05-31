import { IUser } from '@domain/user_model';

export interface UserRepo {
  findAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  update(user: IUser): Promise<IUser | null>;
  delete(id: string): Promise<IUser | null>;
  create(user: IUser): Promise<IUser | null>;
}
