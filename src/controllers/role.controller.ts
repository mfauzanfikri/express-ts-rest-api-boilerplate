import { Request, Response } from 'express';
import RoleModel from '../models/role.model';
import {
  createSuccessResponse,
  sendJsonResponse,
  createInternalServerErrorResponse,
} from '../services/response.service';

const model = RoleModel;

const RoleController = {
  get: async (_: Request, res: Response) => {
    try {
      const roles = await model.findMany();

      const response = createSuccessResponse({
        message: 'Categories data fetched successfully',
        data: roles,
      });

      return sendJsonResponse(res, response);
    } catch (error) {
      const response = createInternalServerErrorResponse();

      return sendJsonResponse(res, response);
    }
  },
  // post: (req: Request, res: Response) => {
  //   res.json({ data: 'data created' });
  // },
  // put: (req: Request, res: Response) => {
  //   res.json({ data: 'data edited' });
  // },
  // delete: (req: Request, res: Response) => {
  //   res.json({ data: 'data delete' });
  // },
};

export default RoleController;
