import { NextFunction, Request, Response } from 'express';
import { ErrorResponse, SuccessResponse } from '../types/responses';
import StatusModel from '../models/status';

const model = StatusModel;

const StatusController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    let status;
    try {
      status = await model.findMany();
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    const response: SuccessResponse = {
      success: true,
      message: 'status data fetched successfully',
      data: status,
    };

    res.json(response);
  },
};

export default StatusController;
