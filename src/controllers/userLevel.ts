import { NextFunction, Request, Response } from 'express';
import { ErrorResponse, SuccessResponse } from '../types/responses';
import UserLevelModel from '../models/userLevel';

const model = UserLevelModel;

const UserLevelController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    let userLevels;
    try {
      userLevels = await model.findMany();
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    const response: SuccessResponse = {
      success: true,
      message: 'userLevels data fetched successfully',
      data: userLevels,
    };

    res.json(response);
  },
};

export default UserLevelController;
