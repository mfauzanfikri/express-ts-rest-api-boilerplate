import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ErrorResponse } from '../types/responses';
import cookieParser from 'cookie';
import generateAccessToken from '../utils/generateAccessToken';

export interface CustomRequest extends Request {
  token: string | jwt.JwtPayload;
}

type Cookies = {
  accessToken: string;
  refreshToken: string;
};

const authToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.cookie) {
    const errMsg: ErrorResponse = {
      status: 401,
      message: 'token required',
    };

    return next(errMsg);
  }

  const cookies = cookieParser.parse(req.headers.cookie) as Cookies;

  if (!cookies.accessToken || !cookies.refreshToken) {
    const errMsg: ErrorResponse = {
      status: 401,
      message: 'token required',
    };

    return next(errMsg);
  }

  const accessToken = cookies.accessToken;
  const refreshToken = cookies.refreshToken;

  try {
    jwt.verify(accessToken as string, process.env.TOKEN_SECRET as string);
  } catch (error) {
    if (error) {
      try {
        const decoded: any = jwt.verify(
          refreshToken as string,
          process.env.TOKEN_SECRET as string
        );
        const id = decoded.id;
        const username = decoded.username;
        const generatedToken = generateAccessToken({ id, username });

        return res
          .cookie('accessToken', generatedToken.accessToken, {
            maxAge: 60 * 60 * 1000,
            secure: false,
            httpOnly: true,
          })
          .json({
            success: true,
            status: 200,
            message: 'authorized',
          });
      } catch (error) {
        const errMsg: ErrorResponse = {
          status: 403,
          message: 'token is invalid or expired',
        };

        return next(errMsg);
      }
    }
  }

  return res.json({
    success: true,
    status: 200,
    message: 'authorized',
  });
};

export default authToken;
