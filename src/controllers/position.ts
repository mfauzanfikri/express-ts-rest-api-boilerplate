import { NextFunction, Request, Response } from 'express';
import { ErrorResponse, SuccessResponse } from '../types/responses';
import PositionModel from '../models/position';

const model = PositionModel;

const PositionController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    let positions;
    try {
      positions = await model.findMany();
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    const response: SuccessResponse = {
      success: true,
      message: 'positions data fetched successfully',
      data: positions,
    };

    res.json(response);
  },
};

export default PositionController;
