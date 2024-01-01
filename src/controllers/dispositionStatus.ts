import { NextFunction, Request, Response } from 'express';
import { ErrorResponse, SuccessResponse } from '../types/responses';
import DispositionStatusModel from '../models/dispositionStatus';
const model = DispositionStatusModel;

const DispositionStatusController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    let dispositionStatus;
    try {
      dispositionStatus = await model.findMany();
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    const response: SuccessResponse = {
      success: true,
      message: 'dispositionStatus data fetched successfully',
      data: dispositionStatus,
    };

    res.json(response);
  },
};

export default DispositionStatusController;
