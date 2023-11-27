import { NextFunction, Request, Response } from 'express';
import { SuccessResponse } from '../types/responses';
import SectionModel from '../models/section';

const model = SectionModel;

const SectionController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    const sections = await model.findMany();

    const response: SuccessResponse = {
      success: true,
      message: 'employees data fetched successfully',
      data: sections,
    };

    res.json(response);
  },
};

export default SectionController;
