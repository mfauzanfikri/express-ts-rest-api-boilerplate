import { NextFunction, Request, Response } from 'express';
import { ErrorResponse, SuccessResponse } from '../types/responses';
import InstructionModel from '../models/instruction';

const model = InstructionModel;

const InstructionController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    let instructions;
    try {
      instructions = await model.findMany();
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    const response: SuccessResponse = {
      success: true,
      message: 'instructions data fetched successfully',
      data: instructions,
    };

    res.json(response);
  },
};

export default InstructionController;
