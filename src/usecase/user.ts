import { Request, Response } from 'express';
import UserRepo from '../repository/UserRepo';

const userRepo = new UserRepo();

/**
 * @desc Fetch all user
 * @route GET /api/v1/user
 * @acces Private
 */
export const getUsers = async (_req: Request, res: Response) => {
  const users = await userRepo.findAll();
  res.status(200).json(users);
};
