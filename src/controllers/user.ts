import { NextFunction, Request, Response } from 'express';
import UserModel, { UserResult, UserData, UserResource } from '../models/user';
import { ErrorResponse, SuccessResponse } from '../types/responses';

const model = UserModel;

const UserController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    let getUsers;
    try {
      getUsers = await model.findMany({
        include: {
          userLevel: {
            select: {
              level: true,
            },
          },
        },
      });
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    let users: any = [];
    getUsers.map((user) => {
      const obj: UserResource = {
        id: user.id,
        username: user.username,
        userLevelId: user.userLevelId,
        userLevel: user.userLevel.level,
        employee: `${process.env.BASE_URL}/employees/${user.employeeId}`,
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

    let getUser;
    try {
      getUser = await model.findFirst({
        where: { id },
        include: {
          userLevel: {
            select: {
              level: true,
            },
          },
        },
      });
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    if (!getUser) {
      const err: ErrorResponse = {
        status: 404,
        message: 'user not found',
      };

      return next(err);
    }

    const user: UserResource = {
      id: getUser.id,
      username: getUser.username,
      userLevelId: getUser.userLevelId,
      userLevel: getUser.userLevel.level,
      employee: `${process.env.BASE_URL}/employees/${getUser.employeeId}`,
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

  getByEmployeeId: async (req: Request, res: Response, next: NextFunction) => {
    const id = Number.parseInt(req.params.id);

    if (!id) {
      const err: ErrorResponse = {
        status: 422,
        message: 'id parameter required',
      };

      return next(err);
    }

    let getUser;
    try {
      getUser = await model.findFirst({
        where: { employeeId: id },
        include: {
          userLevel: {
            select: {
              level: true,
            },
          },
        },
      });
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    if (!getUser) {
      const err: ErrorResponse = {
        status: 404,
        message: 'user not found',
      };

      return next(err);
    }

    const user: UserResource = {
      id: getUser.id,
      username: getUser.username,
      userLevelId: getUser.userLevelId,
      userLevel: getUser.userLevel.level,
      employee: `${process.env.BASE_URL}/employees/${getUser.employeeId}`,
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
    const data: UserData = req.body.data;

    if (!data.username || !data.password || !data.userLevelId) {
      const err: ErrorResponse = {
        status: 422,
        message:
          'username, password, employeeId, and userLevel parameters required',
      };

      return next(err);
    }

    let isExist;
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
          employeeId: data.employeeId,
        },
        include: {
          userLevel: {
            select: {
              level: true,
            },
          },
        },
      });

      const resData: UserResource = {
        id: createdUser.id,
        username: createdUser.username,
        userLevelId: createdUser.userLevelId,
        userLevel: createdUser.userLevel.level,
        employee: `${process.env.BASE_URL}/employees/${createdUser.employeeId}`,
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
      typeof req.body.id === 'number'
        ? req.body.id
        : Number.parseInt(req.body.id);
    const data: UserData = req.body.data;

    if (!userId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'userId required',
      };

      return next(err);
    }

    if (
      !data.username &&
      !data.password &&
      !data.userLevelId &&
      !data.employeeId
    ) {
      const err: ErrorResponse = {
        status: 422,
        message:
          'username, password, employeeId, or userLevel parameters required',
      };

      return next(err);
    }

    let updateData = {};

    for (const key in data) {
      if (
        key !== 'username' &&
        key !== 'password' &&
        key !== 'employeeId' &&
        key !== 'userLevelId'
      ) {
        continue;
      }

      Object.assign(updateData, { [key]: data[key] });
    }

    let isExist: UserResult | null = null;
    try {
      isExist = await model.findFirst({
        where: {
          id: userId,
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

    try {
      const updatedEmployee = await model.update({
        where: { id: userId },
        data: updateData,
        include: {
          userLevel: {
            select: {
              level: true,
            },
          },
        },
      });

      const resData: UserResource = {
        id: updatedEmployee.id,
        username: updatedEmployee.username,
        userLevelId: updatedEmployee.userLevelId,
        userLevel: updatedEmployee.userLevel.level,
        employee: `${process.env.BASE_URL}/employees/${updatedEmployee.employeeId}`,
        createdAt: updatedEmployee.createdAt,
        updatedAt: updatedEmployee.updatedAt,
      };

      const response: SuccessResponse = {
        success: true,
        status: 200,
        message: 'user updated',
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

  delete: async (req: Request, res: Response, next: NextFunction) => {
    const userId: number =
      typeof req.body.id === 'number'
        ? req.body.id
        : Number.parseInt(req.body.id);

    if (!userId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'userId required',
      };

      return next(err);
    }

    let isExist: UserResult | null = null;
    try {
      isExist = await model.findFirst({
        where: {
          id: userId,
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

    try {
      await model.delete({
        where: {
          id: userId,
        },
      });

      const response: SuccessResponse = {
        success: true,
        status: 204,
        message: 'user deleted',
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
};

export default UserController;
