import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/user.model';
import { ErrorResponse, SuccessResponse } from '../types/responses';

const model = UserModel;

const UserController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    const users = await model.findMany({
      select: {
        id: true,
        username: true,
        UserLevel: {
          select: {
            level: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    let customUsers: any = [];
    users.map((user) => {
      const obj = {
        id: user.id,
        username: user.username,
        userLevel: user.UserLevel.level,
      };
      customUsers.push(obj);
    });

    const response: SuccessResponse = {
      success: true,
      status: 200,
      message: 'users data fetched successfully',
      data: customUsers,
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

    const user = await model.findFirst({
      where: { id },
    });

    res.json({ data: 'data' });
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
