import { NextFunction, Request, Response } from 'express';
import { findUserByUsername } from '../models/user.model';
import { ErrorResponse } from '../types/responses';
import validateUser from '../utils/validateUser';
import generateAccessToken from '../utils/generateAccessToken';
import jwt from 'jsonwebtoken';

const AuthController = {
  post: async (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await findUserByUsername(username);

    if (!user) {
      const err: ErrorResponse = {
        success: false,
        status: 401,
        message: 'Email or password is wrong.',
      };

      next(err);
      return false;
    }

    const isValid = validateUser(password, user.password);

    if (!isValid) {
      const err: ErrorResponse = {
        success: false,
        status: 401,
        message: 'Email or password is wrong.',
      };

      next(err);
      return false;
    }

    const token = generateAccessToken({
      id: user.id,
      username: user.username,
    });

    res.json({
      success: true,
      status: 200,
      accessToken: token,
      data: { username: user.username },
    });
  },
  AuthToken: async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      const err: ErrorResponse = {
        success: false,
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
            success: false,
            status: 403,
            message: 'Token is invalid or expired',
          };

          return next(errMsg);
        }

        return res.json({
          success: true,
          status: 200,
          message: 'Authorized',
        });
      }
    );
  },
};

export default AuthController;
