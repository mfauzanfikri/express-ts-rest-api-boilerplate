import { Request, Response } from 'express';
import UserModel, { UserPostData, UserPutData } from '../models/user.model';
import {
  createErrorResponse,
  createInternalServerErrorResponse,
  createSuccessResponse,
  sendJsonResponse,
} from '../services/response.service';
import { HTTP_RESPONSE_CODE } from '../constants';
import { sendInternalServerErrorResponse } from '../services/response.service/send-response';

const model = UserModel;
const statusCode = HTTP_RESPONSE_CODE;

const UserController = {
  get: async (_: Request, res: Response) => {
    try {
      const users = await model.findMany();

      const response = createSuccessResponse({
        message: 'Users data fetched successfully',
        data: users,
      });

      return sendJsonResponse(res, response);
    } catch (error) {
      const response = createInternalServerErrorResponse();

      return sendJsonResponse(res, response);
    }
  },

  getById: async (req: Request, res: Response) => {
    let id: number | undefined;

    try {
      id = Number.parseInt(req.params.id);
    } catch (error) {
      const response = createErrorResponse({
        status: statusCode.clientError.unprocessableContent,
        message: 'id (number) param with required',
      });

      return sendJsonResponse(res, response);
    }

    if (!id) {
      const response = createErrorResponse({
        status: statusCode.clientError.unprocessableContent,
        message: 'id param with required',
      });

      return sendJsonResponse(res, response);
    }

    try {
      const user = await model.findFirst({ where: { id: id } });

      const response = createSuccessResponse({
        message: 'User data fetched successfully',
        data: user,
      });

      sendJsonResponse(res, response);
    } catch (error) {
      const response = createInternalServerErrorResponse();

      sendJsonResponse(res, response);
    }
  },

  post: async (req: Request, res: Response) => {
    const postData: UserPostData = req.body.data;

    if (!postData || !postData.username || !postData.password) {
      const response = createErrorResponse({
        status: statusCode.clientError.unprocessableContent,
        message: 'Missing one or more fields',
      });

      return sendJsonResponse(res, response);
    }

    try {
      const isExist = await model.findFirst({
        where: {
          username: postData.username,
        },
      });

      if (isExist) {
        const response = createErrorResponse({
          status: statusCode.clientError.conflict,
          message: 'User already exists',
        });

        return sendJsonResponse(res, response);
      }
    } catch (error) {
      return sendInternalServerErrorResponse(res);
    }

    try {
      const createdUser = await model.create({
        data: postData,
      });

      const response = createSuccessResponse({
        status: statusCode.success.created,
        message: 'User created',
        data: createdUser,
      });

      return sendJsonResponse(res, response);
    } catch (error) {
      return sendInternalServerErrorResponse(res);
    }
  },

  put: async (req: Request, res: Response) => {
    const id: number =
      typeof req.body.id === 'number'
        ? req.body.id
        : Number.parseInt(req.body.id);
    const putData: UserPutData = req.body.data;

    if (!id) {
      const response = createErrorResponse({
        status: statusCode.clientError.unprocessableContent,
        message: 'id field required',
      });

      return sendJsonResponse(res, response);
    }

    if (
      !putData ||
      (!putData.username && !putData.password && !putData.roleId)
    ) {
      const response = createErrorResponse({
        status: statusCode.clientError.unprocessableContent,
        message: 'Need atleast one data field',
      });

      return sendJsonResponse(res, response);
    }

    const updateData = {};

    for (const key in putData) {
      if (key !== 'username' && key !== 'password' && key !== 'roleId') {
        continue;
      }

      Object.assign(updateData, { [key]: putData[key] });
    }

    try {
      const updatedUser = await model.update({
        data: updateData as UserPutData,
        where: {
          id: id,
        },
      });

      const response = createSuccessResponse({
        status: statusCode.success.ok,
        message: 'User updated',
        data: updatedUser,
      });

      return sendJsonResponse(res, response);
    } catch (error) {
      return sendInternalServerErrorResponse(res);
    }
  },

  delete: async (req: Request, res: Response) => {
    const id: number =
      typeof req.body.id === 'number'
        ? req.body.id
        : Number.parseInt(req.body.id);

    if (!id) {
      const response = createErrorResponse({
        status: statusCode.clientError.unprocessableContent,
        message: 'id field missing',
      });

      return sendJsonResponse(res, response);
    }

    try {
      const isExist = await model.findFirst({
        where: {
          id: id,
        },
      });

      if (isExist) {
        const response = createErrorResponse({
          status: statusCode.clientError.notFound,
          message: 'User not found',
        });

        return sendJsonResponse(res, response);
      }
    } catch (error) {
      return sendInternalServerErrorResponse(res);
    }

    try {
      await model.delete({ where: { id: id } });

      const response = createSuccessResponse({
        status: statusCode.success.noContent,
        message: 'User deleted',
      });

      return sendJsonResponse(res, response);
    } catch (error) {
      return sendInternalServerErrorResponse(res);
    }
  },
};

export default UserController;
