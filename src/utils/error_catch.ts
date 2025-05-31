import { NextFunction, Request, Response } from 'express';

import ResponseModel from '@domain/response_model';

import ErrorMapper from '@utils/error_mapper';
import logger from '@utils/logger';

const errorCatch = (
  err: ErrorMapper,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let message = 'Internal server error';
  let status = '0500';
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  logger.error(err.message);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = `Resource not found`;
    error = new ErrorMapper(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    error = new ErrorMapper(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = err.errors as Error;
    const messages = Object.values(errors).map(v => v.message);

    if ((messages ?? []).length > 0) {
      error = new ErrorMapper(messages[0], 400);
    }
  }

  // Set status body
  status = String(error.statusCode).padStart(4, '0');
  message = error.message;

  res
    .status(error.statusCode ?? 500)
    .json(new ResponseModel(null, status, message));
};

export default errorCatch;
