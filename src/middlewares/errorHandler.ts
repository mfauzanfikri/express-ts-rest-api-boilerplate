import { NextFunction, Request, Response } from 'express';
import { ErrorResponse } from '../types/responses.type';

const errorHandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err) {
    res.status(404).json({
      status: 404,
      message: '404 NOT FOUND',
    });
    return;
  }

  res.status(err.status).json(err);
};

export default errorHandler;
