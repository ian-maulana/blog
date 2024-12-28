import { IUser } from '../domain/UserModel';

export interface IUserRepo {
  findAll(): Promise<IUser[]>;
}
