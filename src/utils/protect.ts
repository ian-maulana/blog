import { NextFunction, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

import ProtectedRequest from '@domain/request_model';

import asyncCatch from '@utils/async_catch';
import { JWT_SECRET } from '@utils/environment';
import ErrorParser from '@utils/error_parser';

import UserRepoImpl from '@repository/user/user_repo_impl';

const userRepo = new UserRepoImpl();

const protect = asyncCatch(
  async (req: ProtectedRequest, _res: Response, next: NextFunction) => {
    let token;

    if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new ErrorParser('Not authorized to access this route', 401));
    }

    try {
      const decoded = verify(token, JWT_SECRET) as JwtPayload;
      req.user = await userRepo.findOne({ id: decoded.id });

      next();
    } catch (_e) {
      return next(new ErrorParser('Not authorized to access this route', 401));
    }
  },
);

export default protect;
