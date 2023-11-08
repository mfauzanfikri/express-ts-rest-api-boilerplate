import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/user.model';
import { ErrorResponse, SuccessResponse } from '../types/responses';

const model = UserModel;

const UserController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    const getUsers = await model.findMany({
      include: {
        UserLevel: {
          select: {
            level: true,
          },
        },
      },
    });

    let users: any = [];
    getUsers.map((user) => {
      const obj = {
        id: user.id,
        username: user.username,
        userLevel: user.UserLevel.level,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      users.push(obj);
    });

    const response: SuccessResponse = {
      success: true,
      message: 'users data fetched successfully',
      data: users,
    };

    res.json(response);
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    const id = Number.parseInt(req.params.id);

    if (!id) {
      const err: ErrorResponse = {
        status: 401,
        message: 'id parameter required',
      };

      return next(err);
    }

    const getUser = await model.findFirst({
      where: { id },
      include: {
        UserLevel: {
          select: {
            level: true,
          },
        },
      },
    });

    if (!getUser) {
      const err: ErrorResponse = {
        status: 401,
        message: 'user is not found',
      };

      return next(err);
    }

    const user = {
      id: getUser.id,
      username: getUser.username,
      userLevel: getUser.UserLevel.level,
      createdAt: getUser.createdAt,
      updatedAt: getUser.updatedAt,
    };

    const response: SuccessResponse = {
      success: true,
      message: 'user data fetched successfully',
      data: user,
    };

    res.json(response);
  },

  post: (req: Request, res: Response, next: NextFunction) => {
    res.json({ data: 'data created' });
  },
  put: (req: Request, res: Response, next: NextFunction) => {
    res.json({ data: 'data edited' });
  },
  delete: (req: Request, res: Response, next: NextFunction) => {
    res.json({ data: 'data delete' });
  },
};

export default UserController;
