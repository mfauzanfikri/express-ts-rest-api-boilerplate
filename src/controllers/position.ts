import { NextFunction, Request, Response } from 'express';
import { SuccessResponse } from '../types/responses';
import PositionModel from '../models/position';

const model = PositionModel;

const PositionController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    const positions = await model.findMany();

    const response: SuccessResponse = {
      success: true,
      message: 'employees data fetched successfully',
      data: positions,
    };

    res.json(response);
  },
};

export default PositionController;
