import { NextFunction, Request, Response } from 'express';
import { ErrorResponse } from '../types/responses';
import { authKey } from '../services/apiService';

const authAPIKey = async (req: Request, res: Response, next: NextFunction) => {
  const key = req.query.api_key;
  let err: ErrorResponse;

  if (!key) {
    err = {
      status: 401,
      message: 'API key required',
    };
    return next(err);
  }

  if (!(await authKey(key as string))) {
    err = {
      status: 403,
      message: 'API key is invalid',
    };
    return next(err);
  }

  return next();
};

export default authAPIKey;
