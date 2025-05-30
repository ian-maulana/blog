import { NextFunction, Request, Response } from 'express';
import { IUser } from '../domain/user_model';
import UserRepoImpl from '../repository/user/user_repo_impl';
import ResponseModel from '../domain/response_model';
import logger from '../utils/logger';
import sendEmail from '../infastructure/send_email';
import asyncCatch from '../utils/async_catch';
import ErrorMapper from '../utils/error_mapper';

const userRepo = new UserRepoImpl();

/**
 * @desc Find all user
 * @route GET /api/v1/user
 * @acces Private
 */
export const getUsers = asyncCatch(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const users = await userRepo.findAll();
    res.status(200).json(new ResponseModel<IUser[]>(users, '0000', 'Success'));
  },
);

/**
 * @desc Find user by id
 * @route GET /api/v1/user/:id
 * @acces Private
 */
export const getUserById = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userRepo.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorMapper(`No user with the id of ${req.params.id}`, 404),
      );
    }

    res
      .status(200)
      .json(new ResponseModel<IUser | null>(user, '0000', 'Success'));
  },
);

/**
 * @desc Create new user
 * @route POST /api/v1/user
 * @acces Private
 */
export const createUser = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const doc = await userRepo.create(req.body);

    const token = await userRepo.getPasswordToken(doc.id);
    const url = `${req.protocol}://${req.get('host')}/password/create?token=${token}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${url}`;

    try {
      await sendEmail({
        email: doc.email,
        subject: 'Create Password',
        message: message,
      });

      res.status(201).json(new ResponseModel<null>(null, '0000', 'Success'));
    } catch (e) {
      logger.error(e);
      doc.passwordToken = undefined;
      doc.passwordTokenExpired = undefined;

      return next(new ErrorMapper('Email could not be sent', 500));
    }
  },
);

/**
 * @desc Update user by id
 * @route PUT /api/v1/user
 * @acces Private
 */
export const updateUser = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userRepo.update(req.body);

    if (!user) {
      return next(
        new ErrorMapper(`No user with the id of ${req.body.id}`, 404),
      );
    }

    res.status(200).json(new ResponseModel<null>(null, '0000', 'Success'));
  },
);

/**
 * @desc Delete user by id
 * @route DELETE /api/v1/user/:id
 * @acces Private
 */
export const deleteUser = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userRepo.delete(req.params.id);

    if (!user) {
      return next(
        new ErrorMapper(`No user with the id of ${req.params.id}`, 404),
      );
    }

    res.status(200).json(new ResponseModel<null>(null, '0000', 'Success'));
  },
);
