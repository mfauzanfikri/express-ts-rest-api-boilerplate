import { NextFunction, Request, Response } from 'express';
import { findUserByUsername } from '../models/user';
import { ErrorResponse } from '../types/responses';
import validateUser from '../utils/validateUser';
import generateAccessToken from '../utils/generateAccessToken';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const AuthController = {
  post: async (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.username;
    const password = req.body.password;

    let user;
    try {
      user = await findUserByUsername(username);
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    if (!user) {
      const err: ErrorResponse = {
        status: 401,
        message: 'Email or password is wrong.',
      };

      next(err);
      return false;
    }

    const isValid = validateUser(password, user.password);

    if (!isValid) {
      const err: ErrorResponse = {
        status: 401,
        message: 'Email or password is wrong.',
      };

      next(err);
      return false;
    }

    const { token, refreshToken } = generateAccessToken({
      id: user.id,
      username: user.username,
    });

    res
      .cookie('access_token', token, {
        maxAge: 60 * 60 * 1000,
        secure: false,
        httpOnly: true,
      })
      .cookie('refresh_token', refreshToken, {
        maxAge: 8 * 60 * 60 * 1000,
        secure: false,
        httpOnly: true,
      })
      .json({
        success: true,
        status: 200,
        data: { id: user.id, username: user.username },
      });
  },
  AuthToken: async (req: Request, res: Response, next: NextFunction) => {
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];

    // if (token == null) {
    //   const err: ErrorResponse = {
    //     status: 401,
    //     message: 'Token required',
    //   };

    //   return next(err);
    // }

    if (req.headers.cookie) {
      console.log(cookie.parse(req.headers.cookie));
    }
    res.json({ ok: 'ok' });

    // jwt.verify(
    //   token,
    //   process.env.TOKEN_SECRET as string,
    //   (err: any, user: any) => {
    //     if (err) {
    //       const errMsg: ErrorResponse = {
    //         status: 403,
    //         message: 'Token is invalid or expired',
    //       };

    //       return next(errMsg);
    //     }

    //     return res.json({
    //       success: true,
    //       status: 200,
    //       message: 'Authorized',
    //     });
    //   }
    // );
  },
};

export default AuthController;
