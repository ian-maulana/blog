import { IUser } from '@domain/user_model';

interface UserRepo {
  find(): Promise<IUser[]>;
  findOne(user: Partial<IUser>): Promise<IUser | null>;
  update(user: IUser): Promise<IUser | null>;
  delete(id: string): Promise<IUser | null>;
  create(user: IUser): Promise<IUser | null>;
}

export default UserRepo;
