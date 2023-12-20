import { NextFunction, Request, Response } from 'express';
import { ErrorResponse, SuccessResponse } from '../types/responses';
import SectionModel from '../models/section';

const model = SectionModel;

const SectionController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    let sections;
    try {
      sections = await model.findMany();
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    const response: SuccessResponse = {
      success: true,
      message: 'sections data fetched successfully',
      data: sections,
    };

    res.json(response);
  },
};

export default SectionController;
