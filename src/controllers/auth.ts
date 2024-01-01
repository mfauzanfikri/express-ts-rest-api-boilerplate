import { NextFunction, Request, Response } from 'express';
import { UserResource, findUserByUsername } from '../models/user';
import { ErrorResponse } from '../types/responses';
import validateUser from '../utils/validateUser';
import generateAccessToken from '../utils/generateAccessToken';
import jwt, { JwtPayload } from 'jsonwebtoken';
import cookieParser from 'cookie';

type Cookies = {
  accessToken: string;
  refreshToken: string;
};

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

    if (username !== user.username) {
      const err: ErrorResponse = {
        status: 401,
        message: 'Email or password is wrong.',
      };

      next(err);
      return false;
    }

    const userResource: UserResource = {
      id: user.id,
      username: user.username,
      userLevelId: user.userLevelId,
      userLevel: user.userLevel.level,
      employee: `${process.env.BASE_URL}/employee/${user.employeeId}`,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const isValid = validateUser(password, user.password);

    if (!isValid) {
      const err: ErrorResponse = {
        status: 401,
        message: 'Email or password is wrong.',
      };

      next(err);
      return false;
    }

    const { accessToken, refreshToken } = generateAccessToken({
      id: user.id,
      username: user.username,
    });

    res
      .cookie('accessToken', accessToken, {
        maxAge: 60 * 60 * 1000,
        secure: false,
        httpOnly: true,
      })
      .cookie('refreshToken', refreshToken, {
        maxAge: 8 * 60 * 60 * 1000,
        secure: false,
        httpOnly: true,
      })
      .json({
        success: true,
        status: 200,
        data: userResource,
      });
  },
  authToken: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.cookie) {
      const errMsg: ErrorResponse = {
        status: 403,
        message: 'token required',
      };

      return next(errMsg);
    }

    const cookies = cookieParser.parse(req.headers.cookie) as Cookies;

    if (!cookies.refreshToken) {
      const errMsg: ErrorResponse = {
        status: 403,
        message: 'token required',
      };

      return next(errMsg);
    }

    const accessToken = cookies.accessToken;
    const refreshToken = cookies.refreshToken;

    if (!accessToken) {
      try {
        const decoded: any = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET as string
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

    try {
      jwt.verify(accessToken as string, process.env.TOKEN_SECRET as string);
    } catch (error) {
      const errMsg: ErrorResponse = {
        status: 403,
        message: 'token is invalid or expired',
      };

      return next(errMsg);
    }

    return res.json({
      success: true,
      status: 200,
      message: 'authorized',
    });
  },
  logout: async (req: Request, res: Response, next: NextFunction) => {
    res
      .cookie('accessToken', '', {
        httpOnly: true,
        maxAge: 0,
      })
      .cookie('refreshToken', '', {
        httpOnly: true,
        maxAge: 0,
      })
      .end();
  },
};

export default AuthController;
