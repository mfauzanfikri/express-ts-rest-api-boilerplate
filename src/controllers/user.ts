import { NextFunction, Request, Response } from 'express';
import UserModel, { UserResult } from '../models/user';
import { ErrorResponse, SuccessResponse } from '../types/responses';

const model = UserModel;

type UserData = {
  username: string;
  password: string;
  userLevelId: number;
};

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
        status: 422,
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
        status: 404,
        message: 'user not found',
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

  post: async (req: Request, res: Response, next: NextFunction) => {
    const data: UserData = JSON.parse(req.body.data);

    if (!data.username || !data.password || !data.userLevelId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'username, password, and userLevel parameters required',
      };

      return next(err);
    }

    const isExist = await model.findFirst({
      where: {
        username: data.username,
      },
    });

    if (isExist) {
      const err: ErrorResponse = {
        status: 409,
        message: 'user already exists',
      };

      return next(err);
    }

    try {
      const createdUser = await model.create({
        data: {
          username: data.username,
          password: data.password,
          userLevelId: data.userLevelId,
        },
        include: {
          UserLevel: {
            select: {
              level: true,
            },
          },
        },
      });

      const resData = {
        id: createdUser.id,
        username: createdUser.username,
        userLevel: createdUser.UserLevel.level,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      };

      const response: SuccessResponse = {
        success: true,
        status: 201,
        message: 'user created',
        data: resData,
      };

      res.json(response);
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }
  },

  put: async (req: Request, res: Response, next: NextFunction) => {
    const userId: number =
      typeof req.body.userId === 'number'
        ? req.body.id
        : Number.parseInt(req.body.userId);
    const data: UserData = JSON.parse(req.body.data);

    if (!userId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'userId required',
      };

      return next(err);
    }

    if (!data.username || !data.password || !data.userLevelId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'username, password, or userLevel parameters required',
      };

      return next(err);
    }

    let updateData = {};

    for (const key in data) {
      if (key !== 'username' && key !== 'password' && key !== 'userLevelId') {
        continue;
      }

      Object.assign(updateData, { [key]: data[key] });
    }

    console.log(updateData);

    let isExist: UserResult | null = null;
    try {
      isExist = await model.findFirst({
        where: {
          username: data.username,
        },
      });
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    if (!isExist) {
      const err: ErrorResponse = {
        status: 404,
        message: 'user does not exist',
      };

      return next(err);
    }

    // let updateData = {};
    // // Object.assign(updateData);

    // for (const key in data) {
    //   console.log({ key });
    // }

    try {
      const createdUser = await model.update({
        where: { id: userId },
        data: {
          username: data.username,
          password: data.password,
          userLevelId: data.userLevelId,
        },
        include: {
          UserLevel: {
            select: {
              level: true,
            },
          },
        },
      });

      const resData = {
        id: createdUser.id,
        username: createdUser.username,
        userLevel: createdUser.UserLevel.level,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      };

      const response: SuccessResponse = {
        success: true,
        status: 201,
        message: 'user created',
        data: resData,
      };

      res.json(response);
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }
  },

  delete: (req: Request, res: Response, next: NextFunction) => {
    res.json({ data: 'data delete' });
  },
};

export default UserController;
