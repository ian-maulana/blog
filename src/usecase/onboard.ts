import { NextFunction, Request, Response } from 'express';
import sendEmail from 'src/infrastructure/send_email';

import ResponseModel from '@domain/response_model';

import asyncCatch from '@utils/async_catch';
import ErrorParser from '@utils/error_parser';
import logger from '@utils/logger';

import OnboardRepoImpl from '@repository/onboard/onboard_repo_impl';

const onboardRepo = new OnboardRepoImpl();

/**
 * @desc Create Password
 * @route POST /api/v1/onboard/password
 * @acces Private
 */
export const createPassword = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await onboardRepo.resetPassword(
      req.params.token,
      req.body.password,
    );

    if (!user) {
      return next(new ErrorParser('Invalid Token', 400));
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
      return next(new ErrorParser('Invalid Token', 400));
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
    const { email } = req.body;
    const token = await onboardRepo.createPasswordToken(email);

    const url = `${req.protocol}://${req.get('host')}/password/create?token=${token}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${url}`;

    try {
      await sendEmail({
        email: email,
        subject: 'Forgot Password',
        message: message,
      });

      res.status(201).json(new ResponseModel(null, '0000', 'Success'));
    } catch (e) {
      logger.error(e);
      return next(new ErrorParser('Email could not be sent', 500));
    }
  },
);
