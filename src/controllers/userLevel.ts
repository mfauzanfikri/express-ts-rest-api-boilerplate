import { NextFunction, Request, Response } from 'express';
import { SuccessResponse } from '../types/responses';
import UserLevelModel from '../models/userLevel';

const model = UserLevelModel;

const UserLevelController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    const userLevels = await model.findMany();

    const response: SuccessResponse = {
      success: true,
      message: 'employees data fetched successfully',
      data: userLevels,
    };

    res.json(response);
  },
};

export default UserLevelController;
