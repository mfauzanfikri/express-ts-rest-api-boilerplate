import { NextFunction, Request, Response } from 'express';
import { SuccessResponse } from '../types/responses';
import InstructionModel from '../models/instruction';

const model = InstructionModel;

const InstructionController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    const instructions = await model.findMany();

    const response: SuccessResponse = {
      success: true,
      message: 'employees data fetched successfully',
      data: instructions,
    };

    res.json(response);
  },
};

export default InstructionController;
