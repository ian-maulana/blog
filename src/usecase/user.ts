import { NextFunction, Response } from 'express';
import sendEmail from 'src/infrastructure/send_email';

import ProtectedRequest from '@domain/request_model';
import ResponseModel from '@domain/response_model';
import { IUser } from '@domain/user_model';

import asyncCatch from '@utils/async_catch';
import ErrorParser from '@utils/error_parser';
import logger from '@utils/logger';

import OnboardRepoImpl from '@repository/onboard/onboard_repo_impl';
import UserRepoImpl from '@repository/user/user_repo_impl';

const userRepo = new UserRepoImpl();
const onboardRepo = new OnboardRepoImpl();

/**
 * @desc Find all user
 * @route GET /api/v1/user
 * @acces Private
 */
export const getUsers = asyncCatch(
  async (_req: ProtectedRequest, res: Response, _next: NextFunction) => {
    const users = await userRepo.find();

    res.status(200).json(new ResponseModel<IUser[]>(users, '0000', 'Success'));
  },
);

/**
 * @desc Find user by id
 * @route GET /api/v1/user/:id
 * @acces Private
 */
export const getUserById = asyncCatch(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await userRepo.findOne({ id });

    if (!user) {
      return next(
        new ErrorParser(`No user with the id of ${req.params.id}`, 404),
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
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const user = await userRepo.create(req.body);

    const token = await onboardRepo.createPasswordToken(user.email);
    const url = `${req.protocol}://${req.get('host')}/password/create?token=${token}`;
    const message = `Thank you for register. Please create your password within this link: \n\n ${url}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Create Password',
        message: message,
      });

      res.status(201).json(new ResponseModel(null, '0000', 'Success'));
    } catch (e) {
      logger.error(e);
      return next(new ErrorParser('Email could not be sent', 500));
    }
  },
);

/**
 * @desc Update user by id
 * @route PUT /api/v1/user
 * @acces Private
 */
export const updateUser = asyncCatch(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const user = await userRepo.update(req.body);

    if (!user) {
      return next(
        new ErrorParser(`No user with the id of ${req.body.id}`, 404),
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
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const user = await userRepo.delete(req.params.id);

    if (!user) {
      return next(
        new ErrorParser(`No user with the id of ${req.params.id}`, 404),
      );
    }

    res.status(200).json(new ResponseModel<null>(null, '0000', 'Success'));
  },
);
