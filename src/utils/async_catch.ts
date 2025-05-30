import { NextFunction, Request, Response } from 'express';

const asyncCatch =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncCatch;
