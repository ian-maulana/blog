import { NextFunction, Request, Response } from 'express';
import sendEmail from 'src/infrastructure/send_email';

import ProtectedRequest from '@domain/protected_request_model';
import ResponseModel from '@domain/response_model';

import asyncCatch from '@utils/async_catch';
import { JWT_COOKIE_EXPIRE } from '@utils/environment';
import ErrorParser from '@utils/error_parser';
import logger from '@utils/logger';

import OnboardRepoImpl from '@repository/onboard/onboard_repo_impl';

const onboardRepo = new OnboardRepoImpl();

/**
 * @desc Change Password
 * @route POST /api/v1/onboard/change-password
 * @acces Private
 */
export const changePassword = asyncCatch(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(
        new ErrorParser('Please input current password & new password', 400),
      );
    }

    const doc = await onboardRepo.updatePassword(
      req.user?.id ?? '',
      req.body.currentPassword,
      req.body.newPassword,
    );

    if (!doc) {
      return next(new ErrorParser('Password is incorrect', 400));
    }

    res.status(200).json(new ResponseModel(null, '0000', 'Success'));
  },
);

/**
 * @desc Logout
 * @route POST /api/v1/onboard/logout
 * @acces Private
 */
export const logout = asyncCatch(
  async (_req: Request, res: Response, _next: NextFunction) => {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json(new ResponseModel(null, '0000', 'Success'));
  },
);

/**
 * @desc Login
 * @route POST /api/v1/onboard/login
 * @acces Private
 */
export const login = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email && !password) {
      return next(new ErrorParser('Please provide an email and password', 400));
    }

    const doc = await onboardRepo.verifyUser(req.body);

    if (!doc) {
      return next(new ErrorParser('Invalid credentials', 401));
    }

    // Create token
    const token = await onboardRepo.getSignedJwtToken(doc.id);
    doc.token = token;

    const options = {
      expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
    };

    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }

    res
      .status(200)
      .cookie('token', token, options)
      .json(new ResponseModel(doc, '0000', 'Success'));
  },
);

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
  async (req: ProtectedRequest, res: Response, _next: NextFunction) => {
    const user = req.user;

    res.status(200).json(new ResponseModel(user, '0000', 'Success'));
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
