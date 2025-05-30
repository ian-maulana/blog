import { NextFunction, Request, Response } from 'express';
import OnboardRepoImpl from '../repository/onboard/onboard_repo_impl';
import ResponseModel from '../domain/response_model';
import ErrorMapper from '../utils/error_mapper';
import asyncCatch from '../utils/async_catch';

const onboardRepo = new OnboardRepoImpl();

/**
 * @desc Create Password
 * @route POST /api/v1/onboard/password
 * @acces Private
 */
export const createPassword = asyncCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await onboardRepo.createPassword(
      req.params.token,
      req.body.password,
    );

    if (!users) {
      return next(new ErrorMapper('Invalid Token', 400));
    }

    res.status(200).json(new ResponseModel(null, '0000', 'Success'));
  },
);
