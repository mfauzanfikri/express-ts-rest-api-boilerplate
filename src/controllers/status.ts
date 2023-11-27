import { NextFunction, Request, Response } from 'express';
import { SuccessResponse } from '../types/responses';
import StatusModel from '../models/status';

const model = StatusModel;

const StatusController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    const statuss = await model.findMany();

    const response: SuccessResponse = {
      success: true,
      message: 'employees data fetched successfully',
      data: statuss,
    };

    res.json(response);
  },
};

export default StatusController;
