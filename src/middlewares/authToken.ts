import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ErrorResponse } from '../types/responses';

export interface CustomRequest extends Request {
  token: string | jwt.JwtPayload;
}

const authToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    const err: ErrorResponse = {
      status: 401,
      message: 'Token required',
    };

    return next(err);
  }

  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    (err: any, user: any) => {
      if (err) {
        const errMsg: ErrorResponse = {
          status: 403,
          message: 'Token is invalid or expired',
        };

        return next(errMsg);
      }

      return next();
    }
  );
};

export default authToken;
