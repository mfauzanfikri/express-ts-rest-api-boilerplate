import { Request, Response } from 'express';
import {
  createErrorResponse,
  createSuccessResponse,
  sendJsonResponse,
} from '../services/response.service';
import { HTTP_RESPONSE_CODE } from '../constants';
import UserModel, { UserResult } from '../models/user.model';
import { sendInternalServerErrorResponse } from '../services/response.service/send-response';
import {
  authenticateUser,
  generateAccessToken,
} from '../services/auth.service';
import cookie from 'cookie';
import {
  verifyAccessToken,
  verifyRefreshToken,
} from '../services/auth.service/token-auth';

type Cookies = {
  accessToken: string;
  refreshToken: string;
};

const statusCode = HTTP_RESPONSE_CODE;
const model = UserModel;

const AuthController = {
  post: async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      const response = createErrorResponse({
        status: statusCode.clientError.unprocessableContent,
        message: 'username and password field required',
      });

      return sendJsonResponse(res, response);
    }

    let user: UserResult | null = null;
    try {
      user = await model.findFirst({ where: { username: username } });
    } catch (error) {
      return sendInternalServerErrorResponse(res);
    }

    if (!user) {
      const response = createErrorResponse({
        status: statusCode.clientError.notFound,
        message: 'user not found',
      });

      return sendJsonResponse(res, response);
    }

    const isAuthenticated = authenticateUser(
      { username, password },
      { username: user.username, password: user.password }
    );

    if (!isAuthenticated) {
      const response = createErrorResponse({
        status: statusCode.clientError.unauthorized,
        message: 'username or password is wrong',
      });

      return sendJsonResponse(res, response);
    }

    const { accessToken, refreshToken } = generateAccessToken({
      id: user.id,
      username: user.username,
    });

    const response = createSuccessResponse({
      status: statusCode.success.ok,
      message: 'authorized',
      data: { user: { id: user.id, username: user.username } },
    });

    return res
      .cookie('accessToken', accessToken, {
        maxAge: 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        httpOnly: true,
      })
      .cookie('refreshToken', refreshToken, {
        maxAge: 8 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        httpOnly: true,
      })
      .status(response.status)
      .json(response);
  },

  authToken: async (req: Request, res: Response) => {
    if (!req.headers.cookie) {
      const response = createErrorResponse({
        status: statusCode.clientError.forbidden,
        message: 'token required required',
      });

      return sendJsonResponse(res, response);
    }

    const cookies = cookie.parse(req.headers.cookie) as Cookies;
    const accessToken = cookies.accessToken;
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      const response = createErrorResponse({
        status: statusCode.clientError.forbidden,
        message: 'token required',
      });

      return sendJsonResponse(res, response);
    }

    if (!accessToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);

        const { id, username } = decoded;

        const generatedToken = generateAccessToken({ id, username });

        let user;
        try {
          user = await UserModel.findFirst({ where: { username: username } });
        } catch (error) {
          return sendInternalServerErrorResponse(res);
        }

        if (!user) {
          const response = createErrorResponse({
            status: statusCode.clientError.unauthorized,
            message: 'user not found',
          });

          return sendJsonResponse(res, response);
        }

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
            data: {
              user: { id: user.id, username: user.username },
            },
          });
      } catch (error) {
        const response = createErrorResponse({
          status: statusCode.clientError.forbidden,
          message: 'token is invalid or expired',
        });

        return sendJsonResponse(res, response);
      }
    }

    // verify accessToken
    let decoded;
    try {
      decoded = verifyAccessToken(accessToken);
    } catch (error) {
      const response = createErrorResponse({
        status: statusCode.clientError.forbidden,
        message: 'token is invalid or expired',
      });

      return sendJsonResponse(res, response);
    }

    let user;
    const { username } = decoded;

    try {
      user = await UserModel.findFirst({ where: { username: username } });
    } catch (error) {
      return sendInternalServerErrorResponse(res);
    }

    if (!user) {
      const response = createErrorResponse({
        status: statusCode.clientError.unauthorized,
        message: 'user not found',
      });

      return sendJsonResponse(res, response);
    }

    return res.json({
      success: true,
      status: 200,
      message: 'authorized',
      data: {
        user: { id: user.id, username: user.username },
      },
    });
  },
  logout: async (_: Request, res: Response) => {
    return res
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
