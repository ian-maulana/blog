import { NextFunction, Request, Response } from 'express';
import sendEmail from 'src/infrastructure/send_email';

import ResponseModel from '@domain/response_model';

import CommonRepoImpl from '@repository/common/common_repo_impl';
import OnboardRepoImpl from '@repository/onboard/onboard_repo_impl';
import UserRepoImpl from '@repository/user/user_repo_impl';

import asyncCatch from '@utils/async_catch';
import ErrorMapper from '@utils/error_mapper';
import logger from '@utils/logger';

const onboardRepo = new OnboardRepoImpl();
const commonRepo = new CommonRepoImpl();
const userRepo = new UserRepoImpl();

/**
 * @desc Create Password
 * @route POST /api/v1/onboard/password
 * @acces Private
 */
export const createPassword = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await onboardRepo.resetPassword(
      req.params.token,
      req.body.password,
    );

    if (!users) {
      return next(new ErrorMapper('Invalid Token', 400));
    }

    res.status(200).json(new ResponseModel(null, '0000', 'Success'));
  },
);

/**
 * @desc Get Me
 * @route GET /api/v1/onboard/me
 * @acces Private
 */
export const getMe = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await onboardRepo.resetPassword(
      req.params.token,
      req.body.password,
    );

    if (!users) {
      return next(new ErrorMapper('Invalid Token', 400));
    }

    res.status(200).json(new ResponseModel(null, '0000', 'Success'));
  },
);

/**
 * @desc Forgot Password
 * @route POST /api/v1/onboard/password
 * @acces Private
 */
export const forgotPassword = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userRepo.findByEmail(req.body.email);

    if (!user) {
      return next(new ErrorMapper('There is no user with that email', 404));
    }

    const token = await commonRepo.getPasswordToken(user.id);
    const url = `${req.protocol}://${req.get('host')}/password/create?token=${token}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${url}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Forgot Password',
        message: message,
      });

      res.status(201).json(new ResponseModel<null>(null, '0000', 'Success'));
    } catch (e) {
      logger.error(e);
      user.passwordToken = undefined;
      user.passwordTokenExpired = undefined;

      return next(new ErrorMapper('Email could not be sent', 500));
    }
  },
);
